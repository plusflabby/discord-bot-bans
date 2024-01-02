// !
// ! Will run all test(s)
// !
console.log(process.argv[process.argv.indexOf('apikey')-1])
console.log(process.argv[process.argv.indexOf('apikey')+1])
console.log(process.argv[process.argv.indexOf('apikey')])
console.log(process.argv[2])
const API = require('./api.js');
API.online().then(console.log);
API.indentities().then(console.log);