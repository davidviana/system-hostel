const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hostelbrbomretiro@gmail.com',
        pass: 'gwhj esyy dgtj pkjj'
    }
});

module.exports = transporter;
