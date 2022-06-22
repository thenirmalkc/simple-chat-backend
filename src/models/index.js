'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const uri = process.env.DB_URL;
const connection = mongoose.createConnection(uri);

// Need to check if connection happened or not

// Importing schema and creating models
const files = fs.readdirSync(path.resolve('src/models'));

for (let i = 0; i < files.length; i++) {
  const filename = path.parse(files[i]).name;
  if (filename === 'index') continue;
  connection.model(filename, require('@models/' + filename));
}

module.exports = connection;
