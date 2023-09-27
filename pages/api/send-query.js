// import nodemailer from 'nodemailer'
// import { MailtrapTransport } from "mailtrap"

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_KEY,
});
const sentFrom = new Sender("smile@shinestudio.in", "Shine Studio");
const recipients = [
    new Recipient("smile@shinestudio.in", "Shine Studio")
];
// const transporter = nodemailer.createTransport({
//     host: 'sandbox.smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//         user: 'f4bdba12105f83',
//         pass: '91e247c083364f'
//     }
// });

// var transport = nodemailer.createTransport({
//     host: "live.smtp.mailtrap.io",
//     port: 587,
//     auth: {
//         user: "api",
//         pass: process.env.MAILTRAP_PASS
//     }
// });
// const mailOptions = ({name, email, phone, msg}) => ({
//     from: {
//         address: 'MS_LcFWtN@shinestudio.in',
//         name: 'Shine Studio'
//     },
//     to: {
//         address: email,
//         name: name || 'User'
//     },
//     subject: 'New Query received from website!',
//     text: `
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone}
//         Message: ${msg}
//     `,
//
//     html: `<strong>
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone}
//         Message: ${msg}
//     </strong>`,
// });




export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}

// const transport = nodemailer.createTransport(MailtrapTransport({
//     token: TOKEN
// }))
export default async function handler (req, res) {
    const {name, email, phone, msg} = req.body
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("New Query received from website!")
        .setHtml(`<strong><br>Name: ${name}<br>Email: ${email}<br>Phone: ${phone}<br>Message: ${msg}</strong>`)
        .setText(`
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${msg}
    `);

    try {
        const result = await mailerSend.email.send(emailParams)
        res.status(200).json({done: true, result: result})
    } catch (e) {
        res.status(500).json({done: false, e})
    }
    // return
    // transport.sendMail(mailOptions(req.body), function(error, info){
    //     if (error) {
    //         res.status(500).json({done: false, error})
    //     } else {
    //         res.status(200).json({done: true, info})
    //     }
    // });
}