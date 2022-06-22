'use strict';

module.exports.JSON = function (req, res, next) {
  res.status(200).json(res.locals.data);
};
