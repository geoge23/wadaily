import { Users, Verifys } from '../../../functions/mongo'
import emailClient from '../../../functions/mail'
import { generateHmacCookie, validateHmacString, getIdFromHmac } from '../../../functions/hmac'

export default async function login(req, res) {
    if (/^http(s)?\:\/\/([a-zA-Z0-9\.]*)?wadaily.co$/i.test(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        res.setHeader('Access-Control-Allow-Credentials', 'true')
    }

    try {
        let { id, code, data, token } = req.body
        if (!token) {
            token = req.cookies.token
        }
        if (token && validateHmacString(token)) {
            const id = getIdFromHmac(token)
            const tokenUser = await Users.findOne({ studentId: id })
            if (tokenUser) {
                res.setHeader('Set-Cookie', `token=${generateHmacCookie(id)}; Path=/; SameSite=None; Secure; Domain=${(new URL(req.headers.origin)).hostname}`)
                return res.status(200).send({ user: tokenUser })
            }
        }
        if (!id) res.status(400).send({ status: "missing_id" })
        const user = await Users.findOne({ studentId: id })
        if (user && (user.emailVerified || code)) {
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
                const verification = await Verifys.findOne({ studentId: id }, null, { sort: { date: -1 }})
                if (verification && verification.challenge == code) {
                    await verification.delete()
                    if (user.emailVerified == false) {
                        user.emailVerified = true
                        await user.save()
                    }
                    //make a cross-site cookie
                    res.setHeader('Set-Cookie', `token=${generateHmacCookie(id)}; Path=/; SameSite=None; Secure; Domain=${(new URL(req.headers.origin)).hostname}`)
                    res.status(200).send({ user, token: generateHmacCookie(id) })
                } else {
                    res.status(401).send({ status: "invalid_code", message: "The code you entered is invalid" })
                }
            }
        } else {
            if (data && data.name && data.email) {
                if (/^[0-9]{2}[a-zA-Z]{1,20}\@woodward\.edu$/.test(data.email) == false && /^[a-zA-Z]{1,20}\.[a-zA-Z]{1,20}\@woodward\.edu$/.test(data.email) == false) {
                    return res.status(400).send({ status: "invalid_data", message: "Your email is invalid" })
                }
                data.email = data.email.toLowerCase()
                if (data.name.length > 30) {
                    return res.status(400).send({ status: "invalid_data", message: "Your name is invalid" })
                }
                if (!user) {
                    const user = new Users({
                        name: data.name,
                        email: data.email,
                        studentId: id
                    })
                    await user.save()
                } else {
                    user.name = data.name
                    user.email = data.email
                    await user.save()
                    await Verifys.deleteMany({ studentId: id })
                }
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
    } catch (e) {
        // catch e11000 error
        if (e.code === 11000) {
            return res.status(400).send({ status: "duplicate" , message: "Your ID or email already exists!"})
        }

        res.status(500).send({ status: "internal_error", message: "An internal error has occurred" })
        throw e
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