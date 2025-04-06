import { EmbedBuilder } from 'discord.js';

export default {
  name: 'yazıtura',
  description: 'Yazı tura atar',
  usage: '',
  aliases: ['yazıtura', 'yazitura', 'yazı-tura', 'yazi-tura', 'coinflip', 'para'],
  cooldown: 3,
  category: 'eglence',
  
  async execute(message, args, client) {
    // Rastgele yazı veya tura
    const sonuc = Math.random() < 0.5 ? 'yazı' : 'tura';
    
    // Para animasyonu için emojiler
    const paraEmojileri = ['🪙', '💰', '💵', '🏆', '🎯'];
    
    // "Atılıyor..." mesajı
    const atiliyorEmbed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('Para atılıyor...')
      .setDescription(`${paraEmojileri[Math.floor(Math.random() * paraEmojileri.length)]} Para havada döndü...`)
      .setTimestamp();
    
    const atiliyorMesaj = await message.channel.send({ embeds: [atiliyorEmbed] });
    
    // Animasyon hissi için 1.5 saniye bekle
    setTimeout(async () => {
      // Sonuç embed'i
      const sonucEmbed = new EmbedBuilder()
        .setColor(sonuc === 'yazı' ? '#4169E1' : '#FF8C00')
        .setTitle(`Para ${sonuc.toUpperCase()} geldi!`)
        .setDescription(`${message.author} para attı ve ${sonuc.toUpperCase()} geldi!`)
        .setThumbnail(sonuc === 'yazı' ? 'https://i.imgur.com/GfxEpPf.png' : 'https://i.imgur.com/vY3cATC.png')
        .setFooter({ text: `${message.author.tag} tarafından atıldı`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      await atiliyorMesaj.edit({ embeds: [sonucEmbed] });
    }, 1500);
  },
}; 