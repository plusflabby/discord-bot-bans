const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setChannel } = require('../../mongo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-channel')
		.setDescription('Set the default channel for logging. Requires Administrator permission!')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel to send logs')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel').id;

		// yet to san
		setChannel(interaction.guildId, channel)
			.finally(async () => {
				await interaction.reply('The log channel has been set to: ' + channel);
			});
	},
};