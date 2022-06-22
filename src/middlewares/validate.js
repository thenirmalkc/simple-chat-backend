'use strict';

const mongoose = require('mongoose');

module.exports.NotFound = function (req, res) {
  res.status(404).json({ msg: 'Not Found' });
};

module.exports.ValidId = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({ msg: 'Invalid Id' });
  next();
};

module.exports.FindById = function (model) {
  return async function (req, res, next) {
    if (!(await model.exists({ _id: req.params.id })))
      return res.status(404).json({ msg: 'Not Found' });
    next();
  };
};
