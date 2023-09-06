import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'
const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'f4bdba12105f83',
        pass: '91e247c083364f'
    }
});

const mailOptions = ({name, email, phone, msg}) => ({
    from: 'smile@shinestudio.in',
    to: 'a.sachin533@gmail.com',
    subject: 'New Query received from website!',
    text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${msg}
    `,

    html: `<strong>
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${msg}
    </strong>`,
});


sgMail.setApiKey("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")


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}
export default function handler (req, res) {
    sgMail
        .send(mailOptions(req.body))
        .then((info) => {
            console.log('Email sent')
            res.status(200).json({done: true, info})
        })
        .catch((error) => {
            res.status(500).json({done: false, error})
        })

    return
    transporter.sendMail(mailOptions(req.body), function(error, info){
        if (error) {
            res.status(500).json({done: false})
        } else {
            res.status(200).json({done: true, info})
        }
    });
}