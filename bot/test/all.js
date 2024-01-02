// !
// ! Will run all test(s)
// !
console.log(process.argv)
const API = require('./api.js');
API.online().then(console.log);
API.indentities().then(console.log);