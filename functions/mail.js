import nodemailer from 'nodemailer'

const mailer = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    auth: {
        user: 'apikey',
        pass: process.env.SMTP_PASS
    }
})
export default mailer