import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'you mail ID',
        pass: '--'
    }
})

export const config = {
    host: 'localhost',
    user: 'root',
    password: 'Stromer/2003',
    database: 'webdev'
};
console.log(transporter);