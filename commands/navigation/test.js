const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test command')
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.followUp({ content: 'test' });
  },
};
