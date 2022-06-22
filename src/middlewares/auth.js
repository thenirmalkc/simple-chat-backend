'use strict';

const jwt = require('jsonwebtoken');
const { models } = require('@models/index');

// Web tokens exp
const webRefreshToken_exp = { expiresIn: 300 };
const webAccessToken_exp = { expiresIn: 120 };

// Secrets
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports.Auth = (...roles) => {
  return function (req, res, next) {
    if (!req.headers.authorization)
      return res.status(401).json({ msg: 'Unauthorized' });
    const accessToken = req.headers.authorization.split(' ')[1];
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, function (err, data) {
      if (err) return res.status(401).json({ msg: 'Unauthorized' });
      if (!roles.length) res.locals.auth = { ...data };
      for (let i = 0; i < roles.length; i++) {
        if (data.role === roles[i]) {
          res.locals.auth = { ...data };
          break;
        }
      }
      if (!res.locals.auth) return res.status(403).json({ msg: 'Forbidden' });
      next();
    });
  };
};

module.exports.verifyAccessToken = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ msg: 'Unauthorized' });
  const accessToken = req.headers.authorization.split(' ')[1];
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, function (err, data) {
    if (err) return res.status(401).json({ msg: 'Unauthorized' });
    res.locals.data = true;
    next();
  });
};

module.exports.verifyRefreshToken = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ msg: 'Unauthorized' });
  const refreshToken = req.headers.authorization.split(' ')[1];
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async function (err, data) {
    if (err) return res.status(401).json({ msg: 'Unauthorized' });
    res.locals.data = true;
    next();
  });
};

module.exports.generateWebTokens = async (req, res, next) => {
  try {
    const { user } = res.locals;
    await models.User.updateOne({ _id: user._id }, { $inc: { webToken: 1 } });
    const refreshTokenData = {
      userId: user._id,
      role: user.role,
      count: user.webToken + 1
    };
    const accessTokenData = {
      userId: user._id,
      role: user.role
    };
    const tokens = {};
    jwt.sign(
      refreshTokenData,
      REFRESH_TOKEN_SECRET,
      webRefreshToken_exp,
      function (err, token) {
        if (err) throw err;
        tokens.refreshToken = token;
        jwt.sign(
          accessTokenData,
          ACCESS_TOKEN_SECRET,
          webAccessToken_exp,
          function (err, token) {
            if (err) throw err;
            tokens.accessToken = token;
            res.locals.data = tokens;
            next();
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Generate Web Tokens' });
  }
};

module.exports.refreshWebTokens = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ msg: 'Unauthorized' });
  const refreshToken = req.headers.authorization.split(' ')[1];
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async function (err, data) {
    if (err) return res.status(401).json({ msg: 'Unauthorized' });
    try {
      const user = await models.User.findById(data.userId)
        .select('_id webToken')
        .lean();
      if (user.webToken !== data.count)
        return res.status(401).json({ msg: 'Unauthorized' });
      await models.User.updateOne(
        { _id: data.userId },
        { $inc: { webToken: 1 } }
      );
      const refreshTokenData = {
        userId: data.userId,
        role: data.role,
        count: data.count + 1
      };
      const accessTokenData = {
        userId: data.userId,
        role: data.role
      };
      const tokens = {};
      jwt.sign(
        refreshTokenData,
        REFRESH_TOKEN_SECRET,
        webRefreshToken_exp,
        function (err, token) {
          if (err) throw err;
          tokens.refreshToken = token;
          jwt.sign(
            accessTokenData,
            ACCESS_TOKEN_SECRET,
            webAccessToken_exp,
            function (err, token) {
              if (err) throw err;
              tokens.accessToken = token;
              res.locals.data = tokens;
              next();
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'Refresh Web Tokens' });
    }
  });
};
