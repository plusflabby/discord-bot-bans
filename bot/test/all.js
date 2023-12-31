// !
// ! Will run all test(s)
// !

const API = require('./api.js');
console.log(String('API :: online ?? ===') + String(await API.online()));