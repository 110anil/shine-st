import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'f4bdba12105f83',
        pass: '91e247c083364f'
    }
});

const mailOptions = ({name, email, phone, msg}) => ({
    from: 'youremail@gmail.com',
    to: 'a.sachin533@gmail.com',
    subject: 'New Query received from website!',
    text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${msg}
    `
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}
export default function handler (req, res) {
    transporter.sendMail(mailOptions(req.body), function(error, info){
        if (error) {
            res.status(500).json({done: false})
            console.log(error);
        } else {
            res.status(200).json({done: true, info})
        }
    });
}