const https = require('https')
const nodemailer = require('nodemailer')
const querystring = require('querystring')

const app = {
    main (request, response) {
        app.handleCors(request, response)
        app.validateCaptcha(request).then(() => {
            app.validateData(request.body).then(() => {
                app.sendMail(request.body).then(info => {
                    response.status(200).send('mail sent')
                }).catch(error => {
                    console.log(error)
                    response.status(500).send('error sending mail')
                })
            }).catch(errors => {
                response.status(422).json(errors)
            })
        }).catch(error => {
            response.status(401).send('unauthorized')
        })
    },
    handleCors (request, response) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
        if (allowedOrigins.indexOf(request.get('origin')) >= 0) {
            response.header('Access-Control-Allow-Origin', '*')
        }
    },
    validateCaptcha (request) {
        return new Promise((resolve, reject) => {
            const verifyData = querystring.stringify({
                secret   : process.env.CAPTCHA_SECRET,
                response : request.body['g-recaptcha-response'],
                remoteip : request.ip
            })

            const verifyReq = https.request({
                hostname : 'www.google.com',
                path     : '/recaptcha/api/siteverify',
                method   : 'POST',
                headers  : {
                    'Content-Type'   : 'application/x-www-form-urlencoded',
                    'Content-Length' : Buffer.byteLength(verifyData)
                }
            }, verifyRes => {
                let responseData = ''
                verifyRes.on('data', data => {
                    responseData += data
                })
                verifyRes.on('end', () => {
                    let response = JSON.parse(responseData)
                    if (!response.success) {
                        reject('unauthorized')
                    } else {
                        resolve()
                    }
                })
            })
            verifyReq.on('error', error => {
                reject(error)
            })
            verifyReq.write(verifyData)
            verifyReq.end()
        })
    },
    validateData (data) {
        return new Promise((resolve, reject) => {
            const { Validator } = require('jsonschema')
            const validator = new Validator
            const validation = validator.validate(data, {
                id : '/',
                type : 'object',
                properties: {
                    name : {
                        type      : 'string',
                        minLength : 10,
                        required  : true
                    },
                    email : {
                        type     : 'string',
                        format   : 'email',
                        required : true
                    },
                    phone : {
                        type     : 'string',
                        pattern  : '^\\([0-9]{2}\\) [0-9]{3}-[0-9]{3}-[0-9]{3}$',
                        required: true
                    } ,
                    message : {
                        type      : 'string',
                        minLength : 30,
                        required  : true
                    }
                }
            })
            if (validation.errors.length > 0){
                reject(validation.errors)
            } else {
                resolve()
            }
        })
    },
    sendMail (data) {
        return new Promise((resolve, reject) => {
            const options = {
                host   : process.env.SMTP_HOST,
                name   : process.env.SERVICE_NAME,
                secure : true,
                auth   : {
                    user : process.env.SMTP_USER,
                    pass : process.env.SMTP_PASS
                }
            }
            const transport = nodemailer.createTransport(options)
            const message = {
                from    : options.auth.user,
                to      : process.env.MAIL_TO,
                replyTo : `${data.name} <${data.email}>`,
                subject : process.env.MAIL_SUBJECT,
                text    : `message from ${data.name}\nphone ${data.phone}\n\n${data.message}`
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
