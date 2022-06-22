'use strict';

const FormatError = require('@helpers/format-error');
const { models } = require('@models/index');
const Role = require('@constants/role');

module.exports.getUser = async function (req, res, next) {
  try {
    const user = await models.User.findById(res.locals.auth.userId);
    res.locals.data = user;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ route: '/user', method: 'get', msg: 'Internal Server Error' });
  }
};

module.exports.createUser = async function (req, res, next) {
  try {
    // Checking if email already registered
    if (await models.User.exists({ email: req.body.email }))
      return res
        .status(422)
        .json([{ name: 'email', msg: 'email already registered' }]);
    const user = await models.User.create(req.body);
    res.locals.data = user;
    next();
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError')
      return res.status(422).json(FormatError(err));
    res
      .status(500)
      .json({ route: '/user', method: 'post', msg: 'Internal Server Error' });
  }
};

module.exports.registerUser = async (req, res, next) => {
  try {
    // Checking if email already registered
    if (await models.User.exists({ email: req.body.email }))
      return res
        .status(422)
        .json([{ name: 'email', msg: 'Email already registered' }]);
    req.body.role = Role.USER; // Assigning user a fixed role
    const user = await models.User.create(req.body);
    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    if (err.name == 'ValidationError')
      return res.status(422).json(FormatError(err));
    res.status(500).json({
      route: '/user/register',
      method: 'post',
      msg: 'Internal Server Error'
    });
  }
};

module.exports.getUserById = async function (req, res, next) {
  try {
    const user = await models.User.findById(req.params.id).lean();
    res.locals.data = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: '/user/:id',
      method: 'get',
      msg: 'Internal Server Error'
    });
  }
};

module.exports.deleteUserById = async function (req, res, next) {
  try {
    await models.User.deleteOne({ _id: req.params.id });
    res.locals.data = true;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: '/user/:id',
      method: 'delete',
      msg: 'Internal Server Error'
    });
  }
};

module.exports.sendMessage = async function (req, res, next) {
  try {
    req.body.receiverId = req.params.id;
    req.body.senderId = res.locals.auth.userId;
    const msg = await models.Message.create(req.body);
    await models.UnseenMessages.updateOne(
      {
        senderId: res.locals.auth.userId,
        receiverId: req.params.id
      },
      { $inc: { unseen: 1 } },
      { upsert: true }
    );
    await models.UnseenMessages.updateOne(
      {
        senderId: req.params.id,
        receiverId: res.locals.auth.userId
      },
      { $set: { unseen: 0 } },
      { upsert: true }
    );
    res.locals.data = msg;
    next();
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError')
      return res.status(422).json(FormatError(err));
    res.status(500).json({
      route: '/user/:id/message',
      method: 'post',
      msg: 'Internal Server Error'
    });
  }
};

module.exports.getMessages = async function (req, res, next) {
  try {
    const msgs = await models.Message.find({
      $or: [
        { senderId: res.locals.auth.userId, receiverId: req.params.id },
        { senderId: req.params.id, receiverId: res.locals.auth.userId }
      ]
    });
    await models.UnseenMessages.updateOne(
      {
        senderId: req.params.id,
        receiverId: res.locals.auth.userId
      },
      { $set: { unseen: 0 } },
      { upsert: true }
    );
    res.locals.data = msgs;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: 'user/:id/messages',
      method: 'get',
      msg: 'Internal Server Error'
    });
  }
};

module.exports.getUnseenMessages = async function (req, res, next) {
  try {
    const unseenMsgs = await models.UnseenMessages.find({
      receiverId: res.locals.auth.userId
    });
    res.locals.data = unseenMsgs;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: 'user/unseen/messages',
      method: 'get',
      msg: 'Internal Server Error'
    });
  }
};
