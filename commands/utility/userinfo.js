const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about a user')
        .addUserOption(option => 
            option.setName('target')
                  .setDescription('The user to get information about')
                  .setRequired(false)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(targetUser.id) || await interaction.guild.members.fetch(targetUser.id);

        const userInfoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${targetUser.tag} Information`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: targetUser.username },
                { name: 'Tag', value: `#${targetUser.discriminator}` },
                { name: 'ID', value: targetUser.id },
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` },
                { name: 'Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:D>` },
                { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', ') || 'No roles' }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [userInfoEmbed] });
    },
};