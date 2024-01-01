// !
// ! Will run all test(s)
// !

// Require enviorment variables
const dotenv = require('dotenv');
dotenv.config();

const API = require('./api.js');
API.online().then(console.log);
API.indentities().then(console.log);