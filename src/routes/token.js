'use strict';

const router = require('express').Router();
const { verifyAccessToken } = require('@middlewares/auth');
const Response = require('@middlewares/response');

router.get('/access/verify', verifyAccessToken, Response.JSON);

module.exports = router;
