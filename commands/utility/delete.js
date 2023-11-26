const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete zones and regions.')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('zone')
        .setDescription('Delete a zone.')
        .addChannelOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the zone.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('region')
        .setDescription('Delete a region.')
        .addChannelOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the region.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (interaction.options.getSubcommand() === 'zone') {
      const zone = interaction.options.getChannel('name');
      const region = zone.parent;

      await interaction.followUp({
        content: `Deleting zone ${zone.name}${
          region ? ' in ' + region.name : ''
        }`,
      });

      await interaction.guild.roles.delete(
        interaction.guild.roles.cache.find((role) => role.name === zone.name),
        'Zone deletion'
      );

      await interaction.guild.channels.delete(zone, 'Zone deletion');

      await interaction.editReply({
        content: `Deleted zone ${zone.name}${
          region ? ' in ' + region.name : ''
        }.`,
      });
    }

    if (interaction.options.getSubcommand() === 'region') {
      const region = interaction.options.getChannel('name');

      await interaction.followUp({
        content: `Deleting region ${region.name}.`,
      });

      await interaction.guild.roles.delete(
        interaction.guild.roles.cache.find((role) => role.name === region.name),
        'Region deletion'
      );

      await interaction.guild.channels.delete(region, 'Region deletion');

      await interaction.editReply({
        content: `Deleted region ${region.name}.`,
      });
    }
  },
};
