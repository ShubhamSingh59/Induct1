import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ssingh995019@gmail.com',
        pass: 'xyuy chwz gqgp gcha'
    }
})

export const config = {
    host: 'localhost',
    user: 'root',
    password: 'Stromer/2003',
    database: 'webdev'
};
console.log(transporter);