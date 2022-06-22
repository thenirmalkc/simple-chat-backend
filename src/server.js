'use strict';

// Allows console.log only in DEBUG is true
if (!process.env.DEBUG) console.log = function () {};

require('module-alias/register'); // Need to be first for module alias to work
require('dotenv').config();
const httpServer = require('@src/socket');

httpServer.listen(process.env.PORT || process.env.HTTP_PORT || 8000, () => {
  console.log('HTTP listening on port ->' + process.env.HTTP_PORT);
});

// // Https server
// const https = require('https');
// const fs = require('fs');
// const path = require('path');
// const options = {
//   key: fs.readFileSync(path.resolve('cert/key.pem')),
//   cert: fs.readFileSync(path.resolve('cert/cert.pem'))
// };
// const httpsServer = https.createServer(options, app);
// httpsServer.listen(process.env.HTTPS_PORT || 7001, () => {
//   console.log('HTTPS listening on port ->' + process.env.HTTPS_PORT);
// });
