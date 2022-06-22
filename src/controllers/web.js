'use strict';

const bcrypt = require('bcrypt');
const { models } = require('@models/index');

module.exports.loginUser = async (req, res, next) => {
  try {
    let validationErrors = [];
    if (!req.body.email)
      validationErrors.push({ name: 'email', msg: 'email is required' });
    if (!req.body.password)
      validationErrors.push({ name: 'password', msg: 'password is required' });
    if (validationErrors.length) return res.status(422).json(validationErrors);

    const user = await models.User.findOne({ email: req.body.email })
      .select('_id role password webToken mobileToken')
      .lean();

    if (!user) return res.status(401).json({ msg: 'Email does not exists' });

    if (!(await bcrypt.compare(req.body.password, user.password)))
      return res.status(401).json({ msg: 'Invalid password' });

    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: '/web/login',
      method: 'post',
      msg: 'Internal Server Error'
    });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    await models.User.findOneAndUpdate(
      { _id: res.locals.auth.userId },
      { $inc: { webToken: 1 } }
    );
    res.locals.data = true;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      route: '/web/logout',
      method: 'post',
      msg: 'Internal Server Error'
    });
  }
};
