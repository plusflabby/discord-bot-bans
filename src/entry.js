const BOT = require('./start');
const BAN_BOT = new BOT();

// Connect to discord
console.log(__filename, new Date(), '... Attempt to run bot ....');
BAN_BOT.run()
	.then(console.log(__filename, new Date(), '.... Successfully started'))
	// .then(BAN_BOT.newMemberEvent('1006697957317419018', '667148022639230985'))
	.catch(error => {throw error;});

// Commands
console.log(__filename, new Date(), '.... Adding commands ....');
BAN_BOT.setUpCommands();

// Event listeners
console.log(__filename, new Date(), '.... Adding events ....');
BAN_BOT.setUpEvents();