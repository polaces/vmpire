const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server'),
    async execute(interaction) {
        const { guild } = interaction;
        const owner = await guild.fetchOwner();

        const serverInfoEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${guild.name} Information`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Server Name', value: guild.name },
                { name: 'Owner', value: owner.user.tag },
                { name: 'Member Count', value: `${guild.memberCount}` },
                { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>` },
                { name: 'Verification Level', value: `${guild.verificationLevel}` },
                { name: 'Boost Level', value: `${guild.premiumTier}` }
            )
            .setImage(guild.bannerURL({ dynamic: true }) || null)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
};