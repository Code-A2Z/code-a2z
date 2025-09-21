import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.ADMIN_EMAIL, // your email address
    pass: process.env.ADMIN_PASSWORD // your email password
  }
});

export default transporter;
