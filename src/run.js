// Require enviorment variables
const dotenv = require('dotenv');
dotenv.config();

// check for params
let debugLogs = false;
if (process.argv.indexOf('-err')) debugLogs = true;

// Require the necessary discord.js classesconst fs = require('node:fs');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
// eslint-disable-next-line no-unused-vars
client.once(Events.ClientReady, c => {
	console.log('Ready!');
});

// Log in to Discord with your client's token
client.login(token);

// commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		if (debugLogs) console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (debugLogs) console.error(`Command ${interaction.commandName} was recieved.`);

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.GuildMemberAdd, member => {
	if (debugLogs) console.log('New member', member.id);
});

client.on(Events.GuildMemberRemove, member => {
	if (debugLogs) console.log('Lost member', member.id);
});