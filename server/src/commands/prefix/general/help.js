import { EmbedBuilder } from 'discord.js';

export default {
  name: 'help',
  description: 'Tüm komutları veya belirli bir komut hakkında bilgi gösterir',
  aliases: ['commands', 'yardım', 'komutlar'],
  usage: '[komut adı]',
  cooldown: 5,
  guildOnly: false,
  args: false,
  category: 'general',
  execute(message, args, client) {
    const { commands } = client;
    const prefix = process.env.PREFIX;

    if (!args.length) {
      const categories = new Map();
      
      commands.forEach(command => {
        const category = command.category || 'general';
        
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        
        categories.get(category).push(command);
      });
      
      const helpEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📚 Komut Listesi')
        .setDescription(`Komut kullanımı: \`${prefix}help [komut adı]\` ile belirli bir komut hakkında daha fazla bilgi alabilirsiniz!`)
        .setTimestamp()
        .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() });

      categories.forEach((commands, category) => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        const commandList = commands.map(cmd => `\`${cmd.name}\``).join(', ');
        
        helpEmbed.addFields({ name: `${categoryName} Komutları`, value: commandList || 'Hiç komut bulunamadı' });
      });

      return message.channel.send({ embeds: [helpEmbed] });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply('Bu komut bulunamadı!');
    }

    const commandEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Komut: ${command.name}`)
      .setTimestamp()
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() });

    if (command.description) commandEmbed.setDescription(command.description);
    if (command.aliases) commandEmbed.addFields({ name: '📎 Alternatifler', value: `${command.aliases.join(', ')}` });
    if (command.usage) commandEmbed.addFields({ name: '🔍 Kullanım', value: `${prefix}${command.name} ${command.usage}` });
    
    commandEmbed.addFields({ name: '⏱️ Bekleme Süresi', value: `${command.cooldown || 3} saniye` });
    
    message.channel.send({ embeds: [commandEmbed] });
  },
}; 