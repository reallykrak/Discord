import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Tüm slash komutlarının listesini gösterir'),
  category: 'general',
  async execute(interaction, client) {
    const { slashCommands } = client;
    
    const categories = new Map();
    
    slashCommands.forEach(command => {
      const category = command.category || 'general';
      
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      
      categories.get(category).push(command);
    });
    
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📚 Slash Komut Listesi')
      .setDescription('Bu botun tüm slash komutlarının listesi aşağıdadır.')
      .setTimestamp()
      .setFooter({ text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.displayAvatarURL() });

    categories.forEach((commands, category) => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      const commandList = commands.map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');
      
      helpEmbed.addFields({ name: `${categoryName} Komutları`, value: commandList || 'Hiç komut bulunamadı' });
    });

    return interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
}; 