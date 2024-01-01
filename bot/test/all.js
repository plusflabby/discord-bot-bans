// !
// ! Will run all test(s)
// !

const API = require('./api.js');
API.online().then(console.log);
API.indentities().then(console.log);