const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test command')
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.reply({ ephemeral: true, content: 'test' });
  },
};
