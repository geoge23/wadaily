import dbConnect, { Users, Verifys } from '../../../functions/mongo'
import emailClient from '../../../functions/mail'
import { generateHmacCookie, validateHmacString, getIdFromHmac } from '../../../functions/hmac'

export default async function login(req, res) {
    //ensure connected to db
    await dbConnect()

    //if the origin is from a subdomain of wadaily.co, allow cross-site requests and the sharing of cookie credentials
    //this regex matches any subdomain of wadaily.co, including wadaily.co itself, and any port
    if (/^http(s)?\:\/\/([a-zA-Z0-9\.]*)?wadaily.co(:[0-9]{1,5})?$/i.test(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        res.setHeader('Access-Control-Allow-Credentials', 'true')
    }

    //if the request is an options request, allow the request
    if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        return res.status(200).send()
    } else if (req.method != 'POST') {
        //Otherwise, if the request isn't a post request, return an error
        return res.status(405).send({ status: "invalid_method" })
    }

    try {
        let { id, code, data, token } = req.body
        //if the token isn't valid, try the cookie
        if (!token) {
            token = req.cookies.token
        }
        //if the token exists and is valid, use it
        if (token && validateHmacString(token)) {
            const id = getIdFromHmac(token)
            const tokenUser = await Users.findOne({ studentId: id })
            if (tokenUser) {
                //make a cross-site cookie
                res.setHeader('Set-Cookie', `token=${generateHmacCookie(id)}; Path=/; SameSite=None; Secure; Domain=${(new URL(req.headers.origin)).hostname}`)
                return res.status(200).send({ user: tokenUser })
            }
        }

        //if they don't have a token and they don't have an id, they need to enter their id
        if (!id) return res.status(400).send({ status: "missing_id" })

        //if they have an id, check if they have an account
        let user = await Users.findOne({ studentId: id })

        //if they have an account, and they're either verified or supplying a verification code, log them in
        if (user && (user.emailVerified || code)) {

            //if they're not providing a code, they must be unverified, so send them a verification email
            //this email differs from the initial sign up emain only in the text, the values are interchangeable
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
                return res.status(401).send({ status: "needs_code" })
            } else {
                //if they are providing a code, check if it's valid
                //more specifically, grab the most recent code for this user and check if it matches
                const verification = await Verifys.findOne({ studentId: id }, null, { sort: { date: -1 } })
                if (verification && verification.challenge == code) {
                    //if it's valid, delete the code
                    await verification.delete()
                    //if the user is unverified, verify them
                    if (user.emailVerified == false) {
                        user.emailVerified = true
                        await user.save()
                    }
                    //make a cross-site cookie
                    res.setHeader('Set-Cookie', `token=${generateHmacCookie(id)}; Path=/; SameSite=None; Secure; Domain=${(new URL(req.headers.origin)).hostname}`)
                    //send the user along with a login token
                    return res.status(200).send({ user, token: generateHmacCookie(id) })
                } else {
                    //if the code is invalid, send an error
                    return res.status(401).send({ status: "invalid_code", message: "The code you entered is invalid" })
                }
            }
        } else {
            //if they don't have an account, or they're not verified and they're not providing a code, they need to sign up
            //if they're providing data, we can trigger the sign-up flow
            if (data && data.name && data.email) {
                //validate the email
                //this regex is a little complicated, but it's to allow for both first.last and 23flast emails
                if (/^[0-9]{2}[a-zA-Z]{1,20}\@woodward\.edu$/.test(data.email) == false && /^[a-zA-Z]{1,20}\.[a-zA-Z]{1,20}\@woodward\.edu$/.test(data.email) == false) {
                    return res.status(400).send({ status: "invalid_data", message: "Your email is invalid" })
                }
                data.email = data.email.toLowerCase()
                //validate the name
                if (data.name.length > 30) {
                    return res.status(400).send({ status: "invalid_data", message: "Your name is invalid" })
                }
                //check if the user already exists
                if (!user) {
                    //if they don't, create them
                    user = new Users({
                        name: data.name,
                        email: data.email,
                        studentId: id
                    })
                    await user.save()
                } else {
                    //if they do, update their name and email
                    user.name = data.name
                    user.email = data.email
                    await user.save()
                    await Verifys.deleteMany({ studentId: id })
                }
                //send them a verification email, since their account likely updated significantly
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
                return res.status(401).send({ user, status: "needs_verification" })

            } else {
                //if they're not providing data, they need to provide data to sign up
                return res.status(400).send({ status: 'missing_data' })
            }
        }
    } catch (e) {
        // catch e11000 error
        // this is a duplicate key error, which means the user already exists
        if (e.code === 11000) {
            //if the duplicate key is the email, and the email is unverified, we can merge the accounts
            if (e.keyPattern.email) {
                const { id, data } = req.body
                const conflictingUser = await Users.findOne({ email: data.email })
                if (conflictingUser && !conflictingUser.emailVerified) {
                    conflictingUser.studentId = id
                    await conflictingUser.save()
                    const code = generateCode()
                    const verify = new Verifys({
                        studentId: id,
                        challenge: code
                    })
                    await verify.save()
                    const email = generateEmail(
                        "Verify your email",
                        conflictingUser.email,
                        conflictingUser.name,
                        "Your verification code is " + code,
                        `<h1>WADaily Accounts Service</h1>
                        <h3>Your verification code is ${code}</h3>
                        <p>Copy and paste this code into the app to verify your email.</p>`
                    )
                    await emailClient.send(email)
                    return res.status(401).send({ status: "needs_verification" })
                }
            }
            return res.status(400).send({ status: "duplicate", message: "Your ID or email already exists! Contact 23gparks@woodward.edu if this is an error" })
        }

        //if there's an internal error, send a generic error message
        console.warn(`${(new Date()).toISOString()} Error in /api/login:\n`, e)
        return res.status(500).send({ status: "internal_error", message: "An internal error has occurred" })
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