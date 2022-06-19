const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();

const {
    MAILER_HOST,
    MAILER_PORT,
    MAILER_USER,
    MAILER_PASS
} = process.env;

const transport = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve('./resources/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./resources/mail'),
    extName: ".html",
}));

module.exports = transport;
