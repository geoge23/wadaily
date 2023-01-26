import { Users, Verifys } from '../../../functions/mongo'
import emailClient from '../../../functions/mail'
import { generateHmacCookie, validateHmacString, getIdFromHmac } from '../../../functions/hmac'

export default async function login(req, res) {
    const { id, code, data, token } = req.body
    if (token && validateHmacString(token)) {
        const id = getIdFromHmac(token)
        const tokenUser = await Users.findOne({ studentId: id })
        if (tokenUser) {
            return res.status(200).send({ user: tokenUser })
        }
    }
    if (!id) res.status(400).send({ status: "missing_id" })
    const user = await Users.findOne({ studentId: id })
    if (user) {
        if (!code) {
            const code = generateCode()
            const verify = new Verifys({
                studentId: id,
                challenge: code
            })
            await verify.save()
            const email = generateEmail(
                "Login Code",
                user.email,
                user.name,
                "Your login code is " + code,
                `<h1>WADaily Accounts Service</h1>
                <h3>Your login code is ${code}</h3>
                <p>Copy and paste this code into the app to login.</p>`
            )
            await emailClient.send(email)
            res.status(401).send({ status: "needs_code" })
        } else {
            const verification = await Verifys.findOne({ studentId: id, challenge: parseInt(code) })
            if (verification) {
                await verification.delete()
                if (user.emailVerified == false) {
                    user.emailVerified = true
                    await user.save()
                }
                res.status(200).send({ user, token: generateHmacCookie(id) })
            } else {
                res.status(401).send({ status: "invalid_code" })
            }
        }
    } else {
        if (data && data.name && data.email) {
            const user = new Users({
                name: data.name,
                email: data.email,
                studentId: id
            })
            await user.save()
            const code = generateCode()
            const verify = new Verifys({
                studentId: id,
                challenge: code
            })
            await verify.save()
            const email = generateEmail(
                "Verify your email",
                user.email,
                user.name,
                "Your verification code is " + code,
                `<h1>WADaily Accounts Service</h1>
                <h3>Your verification code is ${code}</h3>
                <p>Copy and paste this code into the app to verify your email.</p>`
            )
            await emailClient.send(email)
            res.status(401).send({ user, status: "needs_verification" })

        } else {
            res.status(400).send({ status: 'missing_data' })
        }
    }
}

function generateEmail(subject, to, name, plainText, html) {
    return {
        sender: process.env.EMAIL_FROM,
        content: {
            subject,
            plainText,
            html,
        },
        recipients: {
            to: [
                {
                    email: to,
                    displayName: name,
                },
            ],
        },
    };
}

function generateCode() {
    return Math.floor(Math.random() * 900000) + 100000
}