const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update-channel')
		.setDescription('Updates the channel where updates are posted')
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('The ID for the new channel')
				.setRequired(true)),
	async execute(interaction) {
		const channelId = interaction.options.getString('channel', true).toLowerCase();
		fs.readFile('./config.json', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			let jsonData = JSON.parse(data);
			if (!jsonData.ownerIds.includes(interaction.user.id)) {
				interaction.reply("You do not have access to this command.");
			}
			jsonData.DISCORD_CHANNEL_ID = channelId;

			let updatedJsonData = JSON.stringify(jsonData, null, 2);

		fs.writeFile('./config.json', updatedJsonData, 'utf8', (err) => {
			if (err) {
				console.error(err);
				return;
			}
			interaction.reply('File has been updated');
		});
		});
	},
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update-sheet')
		.setDescription('Updates the tracked sheet')
		.addStringOption(option =>
			option.setName('sheet')
				.setDescription('The ID for the new sheet')
				.setRequired(true)),
	async execute(interaction) {
		const sheetId = interaction.options.getString('sheet', true).toLowerCase();
		fs.readFile('./config.json', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			let jsonData = JSON.parse(data);
			if (!jsonData.ownerIds.includes(interaction.user.id)) {
				interaction.reply("You do not have access to this command.");
			}
			jsonData.GOOGLE_SHEET_KEY = sheetId;

			let updatedJsonData = JSON.stringify(jsonData, null, 2);

		fs.writeFile('./config.json', updatedJsonData, 'utf8', (err) => {
			if (err) {
				console.error(err);
				return;
			}
			interaction.reply('File has been updated');
		});
		});
	},
};