import nodemailer from 'nodemailer';

import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants/env.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_PASSWORD,
  },
});

export default transporter;
