const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
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

    if (interaction.options.getSubcommand() === 'zone') {
      const name = interaction.options.getString('name');
      const region = interaction.options.getChannel('region');
      const description = interaction.options.getString('description');

      await interaction.followUp({
        content: `Creating zone ${name} in ${region.name}${
          description ? ' with description ' + description : ''
        }`,
      });

      await interaction.guild.roles.create({
        name: name,
        mentionable: true,
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
              id: interaction.guild.roles.cache.find(
                (role) => role.name === name
              ),
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
        });

      await interaction.editReply({
        content: `Created zone ${name} in ${region.name}${
          description ? ' with description ' + description : ''
        }`,
      });
    }

    if (interaction.options.getSubcommand() === 'region') {
      const name = interaction.options.getString('name');

      await interaction.followUp({
        content: `Creating region ${name}.`,
      });

      await interaction.guild.roles.create({
        name: name,
        mentionable: true,
      });

      await interaction.guild.channels.create({
        name: name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.guild.roles.cache.find(
              (role) => role.name === name
            ),
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
        ],
      });

      await interaction.editReply({
        content: `Created region ${name}.`,
      });
    }
  },
};
