const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands and their descriptions'),
    async execute(interaction) {
        const commands = interaction.client.commands;

        const helpEmbed = {
            color: 0x0099ff,
            title: 'Help - List of Commands',
            description: 'Here are all the available commands:',
            fields: [],
            timestamp: new Date(),
            footer: {
                text: `Requested by ${interaction.user.tag}`,
            },
        };

        commands.forEach((command) => {
            helpEmbed.fields.push({
                name: `/${command.data.name}`,
                value: command.data.description,
                inline: false,
            });
        });

        await interaction.reply({ embeds: [helpEmbed] });
    },
};