import { randomUUID } from 'crypto'
import generateJwtForID from '../../functions/jwt';
import mailer from '../../functions/mail';
import conn, { LoginEvent, User } from "../../functions/mongo";

export default async function handler(req,res) {
    const {email} = req.query
    if (email == undefined) {
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
    console.log(requestDoc)
    try {
        await requestDoc.save()
    } catch (e) {
        if (e.code === 11000) {
            console.log('11000')
            await LoginEvent.deleteOne({email})
            await requestDoc.save()
        } else {
            throw e;
        }
    }

    console.log('dees')

    res.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
    });

    const link = `https://wadaily.co/verify/${secret}`

    // await mailer.sendMail({
    //     from: 'WADaily Accounts <accounts@wadaily.co>',
    //     to: email,
    //     subject: 'Your sign-in link',
    //     html: `
    //     <img src="http://cdn.mcauto-images-production.sendgrid.net/03047e060571c740/72afa473-9d59-4013-986f-8a01f0d3b585/536x564.png" height="100" />
    //     <h2>Here's your sign-in link</h2>
    //     <a href=${link}>Click here</a> to sign in<br>or copy-paste ${link} into your browser
    //     `
    // })
    res.write('data: {"status":"email_sent"}\n\n')
    res.flush()

    const querier = setInterval(() => {
        try {
            console.log('a')
            LoginEvent.findOne({email}).then(async (e) => {
                if (e.completed) {
                    clearInterval(querier)
    
                    if (firstLogin) await userDoc.save()
                    const jwt = await generateJwtForID(userDoc._id)
    
                    res.write(`data: {"status": "success", "jwt": "${jwt}"}\n\n`)
                    res.end()
                }
            })
        } catch (e) {
            res.write(`data: {"status": "error"}\n\n`)
            clearInterval(querier)
            res.end()
        }
    }, 1000)
    req.client.on('close', () => {
        clearInterval(querier)
        LoginEvent.deleteOne({email})
    })
}