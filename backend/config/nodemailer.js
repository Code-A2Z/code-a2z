import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth :{
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS // your email password
    }
})

export default transporter;