const nodemailer = require("nodemailer");

const EMAIL_USERNAME= "0e1c43e5bcce18";
const EMAIL_PASSWORD = "032e0495637f70";
const EMAIL_HOST= "sandbox.smtp.mailtrap.io";
const EMAIL_PORT = "2525";

exports.sendEmail = async function(options) {
    let transport = nodemailer.createTransport({
        host:EMAIL_HOST,
        port:EMAIL_PORT,
        auth: {
            user: EMAIL_USERNAME,
            pass:EMAIL_PASSWORD
        }
    })
    

    const mail = {
        from:options.from,
        to:options.email,
        subject:options.subject,
        text:options.text
    }

    await transport.sendMail(mail)
}

