const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Select a user')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const avatarEmbed = {
            color: 0x0099ff,
            title: `${user.username}'s Avatar`,
            image: {
                url: avatarUrl,
            },
            footer: {
                text: `Requested by ${interaction.user.username}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};