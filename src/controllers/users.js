'use strict';

const { models } = require('@models/index');

module.exports.getUsers = async function (req, res, next) {
  try {
    const users = await models.User.find();
    res.locals.data = users;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: '/users',
      method: 'get',
      msg: 'Internal Server Error'
    });
  }
};
