'use strict';

module.exports = function (error) {
  const index = error.message.indexOf(':') + 1; // index of first ':'
  error = error.message.substr(index, error.length);
  error = error.split(',');

  const e = []; // final error

  for (let i = 0; i < error.length; i++) {
    const a = error[i].split(':');
    e.push({ name: a[0].trim(), msg: a[1].trim() });
  }

  return e;
};
