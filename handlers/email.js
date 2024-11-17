const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host : emailConfig.host,
    port : emailConfig.port,
    auth: {
        user : emailConfig.user,
        pass: emailConfig.pass
    }
});