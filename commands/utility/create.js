const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  AttachmentBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create zones and regions.')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('zone')
        .setDescription('Create a zone.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the zone.')
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('region')
            .setDescription('The region to create the zone in.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('The description of the zone.')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('region')
        .setDescription('Create a region.')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the region.')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const file = await new AttachmentBuilder(
      './public/tick-check-mark-icon-sign-symbol-design-free-png.webp'
    );

    if (interaction.options.getSubcommand() === 'zone') {
      const name = interaction.options.getString('name');
      const region = interaction.options.getChannel('region');
      const description = interaction.options.getString('description');

      let zone;
      let zoneRole;

      await interaction.followUp({
        content: `Creating zone ${name} in ${region.name}${
          description ? ' with description ' + description : ''
        }`,
      });

      await interaction.guild.roles
        .create({
          name: name,
          mentionable: true,
        })
        .then((role) => {
          zoneRole = role;
        });

      await interaction.guild.channels
        .create({
          name: name,
          type: ChannelType.GuildText,
          topic: description,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: zoneRole,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
          ],
        })
        .then((channel) => {
          channel.setParent(region);
          zone = channel;
        });

      await interaction.editReply({
        content: `Created zone ${name} in ${region.name}${
          description ? ' with description ' + description : ''
        }`,
      });

      const zoneEmbed = await new EmbedBuilder()
        .setTitle('Zone Creation')
        .setThumbnail(
          'attachment://tick-check-mark-icon-sign-symbol-design-free-png.webp'
        )
        .setColor(0x00ff7d)
        .addFields([
          {
            name: 'Name',
            value: `<#${zone.id}>`,
            inline: true,
          },
          {
            name: 'Region',
            value: region.name,
            inline: true,
          },
          {
            name: 'Description',
            value: description ? description : 'No description given.',
            inline: false,
          },
          {
            name: 'Role',
            value: `<@&${zoneRole.id}>`,
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
          embeds: [zoneEmbed],
          files: [file],
        });
    }

    if (interaction.options.getSubcommand() === 'region') {
      const name = interaction.options.getString('name');
      const playerCategory = interaction.guild.channels.cache.find(
        (channel) => channel.id === '1178211185640869968'
      );

      const position = playerCategory.position;

      let region;
      let regionRole;

      await interaction.followUp({
        content: `Creating region ${name}.`,
      });

      await interaction.guild.roles
        .create({
          name: name,
          mentionable: true,
        })
        .then((role) => {
          regionRole = role;
        });

      await interaction.guild.channels
        .create({
          name: name,
          type: ChannelType.GuildCategory,
          position: position,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: regionRole,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
              ],
            },
          ],
        })
        .then((channel) => {
          region = channel;
        });

      await interaction.editReply({
        content: `Created region ${name}.`,
      });

      const regionEmbed = await new EmbedBuilder()
        .setTitle('Region Creation')
        .setThumbnail(
          'attachment://tick-check-mark-icon-sign-symbol-design-free-png.webp'
        )
        .setColor(0x00ff7d)
        .addFields([
          {
            name: 'Name',
            value: region.name,
            inline: false,
          },
          {
            name: 'Role',
            value: `<@&${regionRole.id}>`,
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
