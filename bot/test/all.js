// !
// ! Will run all test(s)
// !

const API = require('./API.js');
console.log(String('API :: online ?? ===') + String(await API.online()));