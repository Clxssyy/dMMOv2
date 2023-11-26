const {
  SlashCommandBuilder,
  ChannelType,
  AttachmentBuilder,
  EmbedBuilder,
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

    const file = await new AttachmentBuilder(
      './public/round-cross-mark-symbol-with-transparent-background-free-png.webp'
    );

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

      const zoneEmbed = await new EmbedBuilder()
        .setTitle('Zone Deletion')
        .setThumbnail(
          'attachment://round-cross-mark-symbol-with-transparent-background-free-png.webp'
        )
        .setColor(0xff0000)
        .addFields([
          {
            name: 'Name',
            value: zone.name,
          },
          {
            name: 'Region',
            value: region.name,
          },
          {
            name: 'By',
            value: `<@${interaction.user.id}>`,
            inline: true,
          },
          {
            name: '\u200b',
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true,
          },
        ])
        .setTimestamp();

      await interaction.guild.channels.cache
        .find((channel) => channel.id === '1178199804753481789')
        .send({
          embeds: [zoneEmbed],
          files: [file],
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

      const regionEmbed = await new EmbedBuilder()
        .setTitle('Region Deletion')
        .setThumbnail(
          'attachment://round-cross-mark-symbol-with-transparent-background-free-png.webp'
        )
        .setColor(0xff0000)
        .addFields([
          {
            name: 'Name',
            value: region.name,
            inline: false,
          },
          {
            name: 'By',
            value: `<@${interaction.user.id}>`,
            inline: true,
          },
          {
            name: '\u200b',
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true,
          },
        ])
        .setTimestamp();

      await interaction.guild.channels.cache
        .find((channel) => channel.id === '1178199804753481789')
        .send({
          embeds: [regionEmbed],
          files: [file],
        });
    }
  },
};
