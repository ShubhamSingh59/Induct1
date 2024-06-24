import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import path from 'path';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { fileURLToPath } from 'url';

const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

import { config } from './Private/config.js';
import { transporter } from './Private/config.js';
import { error, info } from 'console';
import { type } from 'os';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = mysql.createConnection(config);
//app.use(express.static(path.join(__dirname+'/admin')));
const frontpath = path.join(__dirname, '../admin')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory for storing uploaded files
        
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original filename
    }
});
const upload = multer({ storage: storage });
//console.log(upload.storage);
app.use(express.static(frontpath))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log("connected with database");
})
app.get('/', (req, res) => {
    res.sendFile(path.join(frontpath, 'index.html'));
});
app.get('/events', (req, res) => {
    res.sendFile(path.join(frontpath, 'events.html'));
});
app.post('/new-event', async (req, res) => {
    const data = {
        eventName: req.body.eventName,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description
    };
    console.log(1);
    console.log(data);
    const query = `INSERT INTO Events (eventName, location, date,description) VALUES (?, ?,?,?)`;
    connection.query(query, [data.eventName, data.location, data.date, data.description], (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            res.status(500).send({ status: 500, message: 'Failed to insert data' });
            return;
        }
        res.status(200).send({ status: 200, message: 'Event added successfully', results });
    });
})
app.get('/api/events', async (req, res) => {
    const query = 'SELECT * FROM Events';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying data: ' + err.stack);
            res.status(500).send({ status: 500, message: 'Failed to retrieve data' });
            return;
        }
        res.status(200).json({ status: 200, message: 'Event retrieved successfully', results });
    });
});
app.delete('/api/delete-event/:name', async (req, res) => {
    const eventName = req.params.name;
    console.log(eventName);
    const query = `DELETE FROM Events WHERE eventName = ?`;
    connection.query(query, [eventName], (err, results) => {
        if (err) {
            console.error('Error querying data: ' + err.stack);
            res.status(500).send({ status: 500, message: 'Failed to retrieve data' });
            return;
        }
        res.status(200).json({ status: 200, message: 'Event retrieved successfully', results });
    });
});
app.post('/api/join-event', async (req, res) => {
    const data = {
        eventName: req.body.eventName,
        name: req.body.yourName,
        email: req.body.yourEmail,
        designation: req.body.yourDesignation,
        number: req.body.yourNumber
    };
    console.log(1);
    console.log(data);
    const query = `INSERT INTO eventJoiners (eventName, name, email,designation,number) VALUES (?, ?,?,?,?)`;
    connection.query(query, [data.eventName, data.name, data.email, data.designation, data.number], (err, results) => {
        if (err) {
            console.error('Error inserting data: ' + err.stack);
            res.status(500).send({ status: 500, message: 'Failed to insert data' });
            return;
        }
        res.status(200).send({ status: 200, message: 'Event added successfully', results });
    });
})
app.get('/api/eventJoiner', async (req, res) => {
    const query = 'SELECT * FROM eventJoiners';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying data: ' + err.stack);
            res.status(500).send({ status: 500, message: 'Failed to retrieve data' });
            return;
        }
        res.status(200).json({ status: 200, message: 'Data retrieved successfully', results });
    });
});
app.delete('/api/delete-joiner/:mail', async (req, res) => {
    const mail = req.params.mail;
    const query = `DELETE FROM eventJoiners WHERE email = ?`
    connection.query(query, [mail], (err, results) => {
        if (err) {
            console.error('Error querying data: ' + err.stack);
            res.status(500).json({ status: 500, message: err });
            return;
        }
        res.status(200).json({ status: 200, message: 'Data retrieved successfully', results });
    });
});
app.post('/api/multi-delete', async (req, res) => {
    const emails  = req.body.emails;
    console.log(emails);
    if (!emails || emails.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid emails provided' });
    }
    try {
        const query = `DELETE FROM eventJoiners WHERE email IN (?)`;
        connection.query(query, [emails], (err, results) => {
            if (err) {
                console.log(err);
                console.error('Error querying data: ' + err.stack);
                res.status(500).json({ status: 500, message: err });
                return;
            }
            res.status(200).json({ status: 200, message: 'Data retrieved successfully', results });
        })
    }
    catch (error) {
        console.log(error);
    }

});
app.post('/api/send-email', upload.single('attachment'),async (req, res) => {
    const { recipient, subject, html } = req.body;
    console.log(recipient);
    console.log(subject);
    console.log(html);
    const attachment = req.file;
    let attachmentPath = null;
    if (attachment) {
        attachmentPath = `${req.protocol}://${req.get('host')}/uploads/${attachment.filename}`;
        console.log('Received attachment path:', attachmentPath);
    }
    //const filePath = 'C:\\Users\\SHUBHAM\\OneDrive\\Desktop\\InDuckt\\kriti\\admin\\assets\\images\\blogs\\blog1.png'
    const mailOptions = {
        from: 'mail',
        to: recipient,
        subject: subject,
        html: html,
        attachments: []
    };
    console.log(mailOptions);

    if (attachmentPath) {
        mailOptions.attachments.push({
            filename: attachment.originalname,
            path: attachment.path // Use attachment buffer directly
        });
    }
    
    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Failed to send email.', error: err });
            return;
        }
        console.log('Email sent: ' + info.response),
            res.status(200).send({ message: 'Email sent successfully!', info: info.response })

    })
});