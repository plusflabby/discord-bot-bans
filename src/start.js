// ///////////////////
// ///// IMPORTS /////
// ///////////////////
// IMPORT PACKAGES
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
// IMPORT FILES
const { discord_join, alt_accounts, check_if_banned } = require('./axios-post');
const { getChannel } = require('./mongo');
// IMPORT VARIABLES
const token = process.env.DISCORD_TOKEN;
const DEBUG_LOGS = process.argv.indexOf('-err') > -1;
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
			this.newMemberEvent(member.id, member.guild.id);
		});
	}

	async newMemberEvent(memberId, guildId) {
		if (DEBUG_LOGS) console.log(__filename, new Date(), '+ member', memberId);

		try {
			const discordData = await discord_join(memberId);
			const discordChannelId = await getChannel(guildId);
			// No channelId set so no messages
			if (typeof discordChannelId != 'string') return;
			const channel = await this.client.channels.fetch(discordChannelId);
			if (!channel) return;
			// Send message in discord channel
			const embedMsg = new EmbedBuilder()
				.setColor(0x0099FF)
				.setDescription(`<@${memberId}>`)
				// There can be up to 25 fields //
				.addFields(
					{ name: 'Discord UID', value: String(memberId), inline: true },
					{ name: 'Player UID', value: String(discordData.player_uid), inline: true },
				);
			const msg = await channel.send({ embeds: [embedMsg] });
			if (discordData.id < 0) return;

			const alts = await alt_accounts(discordData.id);
			if (alts < 0) return;

			const updatedMsg = embedMsg.addFields({ name: 'Alt-Accounts', value: String(alts.length), inline: true });
			if (alts.length > 0) {
				updatedMsg.addFields({ name: '\u200B', value: '\u200B' });
				const accounts = alts.length > 19 ? 19 : alts.length;
				for (let index = 0; index < accounts; index++) {
					const acc_info = await check_if_banned(alts[index].player_uid);
					updatedMsg.addFields({ name: String(alts[index].name), value: acc_info.banned ? 'banned' : 'not-banned', inline: true });
				}
			}
			msg.edit({ embeds: [updatedMsg] });
		}
		catch (error) {
			console.error(__filename, new Date(), error);
		}
	}
}
// ///////////////////
// ///// EXPORT //////
// ///////////////////
module.exports = Bot;