import { randomUUID } from 'crypto'
import { generateJwtForID } from '../../functions/jwt';
import mailer from '../../functions/mail';
import conn, { LoginEvent, User } from "../../functions/mongo";

export default async function handler(req,res) {
    const {email} = req.query
    if (email == undefined || !/^.+@woodward\.edu$/.test(email)) {
        return res.status(400).send()
    }
    
    await conn();
    let userDoc = await User.findOne({email})
    let firstLogin = false;
    if (userDoc === null) {
        userDoc = new User({email})
        firstLogin = true;
    }

    const secret = randomUUID()
    const requestDoc = new LoginEvent({
        email,
        secret
    })
    try {
        await requestDoc.save()
    } catch (e) {
        if (e.code === 11000) {
            await LoginEvent.deleteOne({email})
            await requestDoc.save()
        } else {
            throw e;
        }
    }


    res.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
    });

    const link = `https://wadaily.co/verify/${secret}`

    await mailer.sendMail({
        from: 'WADaily Accounts <accounts@wadaily.co>',
        to: email,
        subject: 'Your sign-in link',
        html: `
        <img src="http://cdn.mcauto-images-production.sendgrid.net/03047e060571c740/72afa473-9d59-4013-986f-8a01f0d3b585/536x564.png" height="100" width="100" />
        <h2>Here's your sign-in link</h2>
        <a href=${link}>Click here</a> to sign in<br>or copy-paste ${link} into your browser
        <p>Heads up! This link only lasts for 10 minutes</p>
        `
    })
    res.write('data: {"status":"email_sent"}\n\n')
    res.flush()

    const querier = setInterval(() => {
        try {
            LoginEvent.findOne({email}).then(async (e) => {
                if ((new Date()) - e.date > (10 * 60 * 1000 /*10 min in ms*/)) {
                    clearInterval(querier)

                    res.write(`data: {"status": "error", "error": "Server timed out... Did you wait longer than 10 mins?"}\n\n`)
                    return res.end()
                } else if (e.completed) {
                    clearInterval(querier)
    
                    if (firstLogin) await userDoc.save()
                    const jwt = await generateJwtForID(userDoc._id)
    
                    res.write(`data: {"status": "success", "jwt": "${jwt}", "user": ${JSON.stringify(userDoc)}, "firstLogin": ${firstLogin}}\n\n`)
                    res.end()
                }
            })
        } catch (e) {
            res.write(`data: {"status": "error"}\n\n`)
            clearInterval(querier)
            res.end()
        }
    }, 1000)
    req.client.on('close', async () => {
        clearInterval(querier)
        await LoginEvent.deleteOne({email})
    })
}