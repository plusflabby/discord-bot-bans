const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setRole } = require('../../mongo');
// const { setChannel } = require('../../mongo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-role')
		.setDescription('Set a role for banned discord member when join. Requires Administrator permission!')
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('The role to add on banned member')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		// const channel = interaction.options.getChannel('channel').id;
		const role = interaction.options.getRole('role').id;
		await setRole(interaction.guildId, role);
		await interaction.reply('The banned role has been set to: ' + role);
	},
};