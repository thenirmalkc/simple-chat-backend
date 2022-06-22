'use strict';

const router = require('express').Router();
const controller = require('@controllers/user');
const Response = require('@middlewares/response.js');
const validate = require('@middlewares/validate');
const { models } = require('@models/index');
const { Auth, generateWebTokens } = require('@middlewares/auth');
const Role = require('@constants/role');

router.get('/', Auth(), controller.getUser, Response.JSON);
router.post('/', Auth(Role.ADMIN), controller.createUser, Response.JSON);
router.post(
  '/register',
  controller.registerUser,
  generateWebTokens,
  Response.JSON
);
router.get(
  '/:id',
  Auth(),
  validate.ValidId,
  validate.FindById(models.User),
  controller.getUserById,
  Response.JSON
);
router.delete(
  '/:id',
  Auth(Role.ADMIN),
  validate.ValidId,
  validate.FindById(models.User),
  controller.deleteUserById,
  Response.JSON
);
router.post(
  '/:id/message',
  Auth(Role.USER),
  validate.ValidId,
  validate.FindById(models.User),
  controller.sendMessage,
  Response.JSON
);
router.get(
  '/unseen/messages',
  Auth(Role.USER),
  controller.getUnseenMessages,
  Response.JSON
);

router.get(
  '/:id/messages',
  Auth(Role.USER),
  validate.ValidId,
  validate.FindById(models.User),
  controller.getMessages,
  Response.JSON
);

module.exports = router;
