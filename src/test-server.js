require('dotenv').config()

const express = require('express')
const app = require('./index')
const server = express()
const port = 8000

server.get('/', app.main)

server.listen(port, function () {
    console.log(`Test app listening on http://localhost:${port}`)
})
