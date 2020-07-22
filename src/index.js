const nodemailer = require('nodemailer')

const app = {
    main (req, res) {
        app.sendMail()
            .then(info => {
                res.status(200).send('mail sent')
            })
            .catch(error => {
                console.log(error)
                res.status(500).send('error sending mail')
            })
    },
    sendMail () {
        return new Promise((resolve, reject) => {
            const options = {
                host  : process.env.SMTP_HOST,
                name  : process.env.SERVICE_NAME,
                secure: true,
                auth  : {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            }
            const transport = nodemailer.createTransport(options)
            const message = {
                from   : options.auth.user,
                to     : process.env.MAIL_TO,
                subject: 'test contact from site',
                text   : 'test contact from site'
            }
            transport.sendMail(message, function(error, info) {{}
                if (error) {
                    reject(error)
                } else {
                    resolve(info)
                }
            })
        })
    }
}

module.exports = app
