const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bot\'s latency'),
    async execute(interaction) {
        const reply = await interaction.reply({ content: 'Pong!', fetchReply: true });
        const latency = reply.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong! Latency is ${latency}ms`);
    },
};