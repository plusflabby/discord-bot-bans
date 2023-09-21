// ///////////////////
// ///// IMPORTS /////
// ///////////////////
// IMPORT PACKAGES
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
// IMPORT FILES
const { discord_join } = require('./axios-post');
const { getChannel } = require('./mongo');
// IMPORT VARIABLES
const { token } = process.env.DISCORD_TOKEN;
const DEBUG_LOGS = process.argv.indexOf('-err') || false;
// ///////////////////
// ////// CLASS //////
// ///////////////////
class Bot {
	constructor() {
		this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
	}

	async run() {
		// When the client is ready, run this code (only once)
		// We use 'c' for the event parameter to keep it separate from the already defined 'client'
		// eslint-disable-next-line no-unused-vars
		this.client.once(Events.ClientReady, () => {
			if (DEBUG_LOGS) console.log(__filename, new Date(), '<ban-bot> Ready and waiting events!');
		});

		// Log in to Discord with your client's token
		this.client.login(token);
	}

	setUpCommands() {
		this.client.commands = new Collection();
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
					this.client.commands.set(command.data.name, command);
				}
				else {
					console.log(__filename, new Date(), `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			}
		}
	}

	setUpEvents() {
		this.client.on(Events.InteractionCreate, async interaction => {
			if (!interaction.isChatInputCommand()) return;
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				if (DEBUG_LOGS) console.error(__filename, new Date(), `No command matching ${interaction.commandName} was found.`);
				return;
			}
			if (DEBUG_LOGS) console.error(__filename, new Date(), `Command ${interaction.commandName} was recieved.`);
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

		this.client.on(Events.GuildMemberAdd, async member => {
			if (DEBUG_LOGS) console.log(__filename, new Date(), '+ member', member.id);

			try {
				// Discord id with alt accounts 1006697957317419018
				const discordData = await discord_join(member.id);
				// flabbys discord id 667148022639230985
				const discordChannelId = await getChannel(member.guild.id);
				// No channelId set so no messages
				if (typeof discordChannelId != 'string') return;
				const channel = await this.client.channels.fetch(discordChannelId);
				if (!channel) return;
				// Send message in discord channe;
				const altAccountList = discordData[0] ? '\n```' + setUpAltAccounts(discordData[1]) + '```' : '';
				channel.send({ content: `<@${member.id}> just joined discord and is ${discordData[0] ? '**banned**' : 'not-banned'}${altAccountList}` });
			}
			catch (error) {
				console.error(__filename, new Date(), error);
			}
		});
	}
}
// ///////////////////
// //// FUNCTIONS ////
// ///////////////////
function setUpAltAccounts(arrOfAccounts) {
	const len = arrOfAccounts.length;
	let returnString = '';
	if (len > 0) {
		for (let index = 0; index < arrOfAccounts.length; index++) {
			const account = arrOfAccounts[index];

			returnString = returnString + '\n' + (index + 1) + '.' + account.name;
		}
		return returnString;
	}
	else {
		return '1. No alt accounts found';
	}
}
// ///////////////////
// ///// EXPORT //////
// ///////////////////
module.exports = Bot;