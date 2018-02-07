const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

module.exports = app;
