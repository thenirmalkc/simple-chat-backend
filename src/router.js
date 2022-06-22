'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validate = require('@middlewares/validate');

// Middlewares
app.use(cors());
app.use(express.json()); // JSON
app.use(bodyParser.urlencoded({ extended: false })); // Body Parser

// Routes
app.use('/token', require('@routes/token'));
app.use('/user', require('@routes/user'));
app.use('/users', require('@routes/users'));
app.use('/web', require('@routes/web'));
app.use('/', validate.NotFound);

module.exports = app;
