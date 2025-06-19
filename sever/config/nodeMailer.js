import nodemailer from 'nodemailer';

// Create a transporter 
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS
    }
});

export default transporter;
