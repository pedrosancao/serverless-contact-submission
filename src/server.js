require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = require('./index');
const server = express();
const port = 8000;

server.use(bodyParser.urlencoded({ extended: true }));

server.post('/', app.main);

server.listen(port, function () {
    console.log(`Now listening on http://localhost:${port}`);
});
