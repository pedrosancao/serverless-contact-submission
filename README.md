# Serverless Contact Form Submission

Microservice for contact form submission on serverless services such Google Cloud Functions
with CORS handling, recaptcha verification, data validation and SMTP client.

It's perfect to use for GitHub Pages, static generated sites and static sites.

This Node service has small footprint as it only require two other packages that do not
add new dependencies: [jsonschema][0] for validation and [nodemailer][1] for SMTP client.
Recaptcha verifier uses native modules.

## Black lives matter

**This repository has no master**. Read more:
[GitHub abandons 'master' term to avoid slavery row][master-replace].

## Instaling on Google Cloud Functions

- Zip this project and upload onto the Google Cloud Function
- Set the function to be executed: `main` (on [src/index.js](./src/index.js))
- Set the environment variables (example on [.env.example](./.env.example))
    - `ALLOWED_ORIGINS` - allowed origins to make CORS request, include
      protocol and port if applicable, comma separate multiple entries
    - `SMTP_HOST` - SMTP provider address
    - `SMTP_USER` - e-mail account to use as sender
    - `SMTP_PASS` - password for the e-mail account
    - `SERVICE_NAME` - how the service identify itself for the SMTP server
    - `MAIL_TO` - e-mail account to receive the contact form
    - `MAIL_SUBJECT` - subject for contact e-mail
    - `CAPTCHA_SECRET` - Google recaptcha secret
- Deploy

## Local environment

The local environment runs a HTTP server with express just like in GCP, it can be used to make
debuging easier or to run the service on other infrastructure.

The environment variables will be read from ".env" file so copy from [.env.example](./.env.example).

After installing dependencies execute `npm run serve` to start the service.

---

## Consideration for AWS Lambda

Currently this service won't run on AWS Lambda, to add support keep in mind:

- dependencies must be included in the uploaded ZIP ([they don't install it for you][2] - Boo AWS!!)
- the property "main" of package.json is not read, Lambda will look for index.js in root directory
- the function to be called currently is `main` but Lambda require it to be `handler`
- main method call signature does not match - this project uses the express signature
  `(request, response) => {}` and Lambda has its own signature `(event, context, callback) => {}`
  which impacts how request's data are retrieved and HTTP headers/status code are returned

[0]: https://www.npmjs.com/package/jsonschema
[1]: https://www.npmjs.com/package/nodemailer
[2]: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html#nodejs-package-dependencies
[master-replace]: https://www.bbc.com/news/technology-53050955
