'use strict';

const router = require('express').Router();
const controller = require('@controllers/web');
const {
  Auth,
  generateWebTokens,
  refreshWebTokens
} = require('@middlewares/auth');
const Response = require('@middlewares/response');

router.post('/login', controller.loginUser, generateWebTokens, Response.JSON);
router.post('/logout', Auth(), controller.logoutUser, Response.JSON);
router.get('/token/refresh', refreshWebTokens, Response.JSON);

module.exports = router;
