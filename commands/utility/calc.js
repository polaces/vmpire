const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculate')
        .setDescription('Performs basic arithmetic operations')
        .addStringOption(option =>
            option.setName('expression')
                  .setDescription('The arithmetic expression to calculate (e.g., 5 + 3)')
                  .setRequired(true)
        ),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');
        let result;

        try {
            const formattedExpression = expression.replace(/x/g, '*');

            result = eval(formattedExpression);
            if (typeof result !== 'number' || isNaN(result)) {
                throw new Error('Invalid expression');
            }
        } catch (error) {
            result = 'Error: ' + error.message;
        }

        const calcEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Calculation Result')
            .addFields(
                { name: 'Expression', value: `\`\`\`${expression}\`\`\`` },
                { name: 'Result', value: `\`\`\`${result}\`\`\`` }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [calcEmbed] });
    },
};