'use strict';

const router = require('express').Router();
const controller = require('@controllers/users');
const Response = require('@middlewares/response.js');
const { Auth } = require('@middlewares/auth');

router.get('/', Auth(), controller.getUsers, Response.JSON);

module.exports = router;
