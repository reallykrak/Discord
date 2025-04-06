import { EmbedBuilder } from 'discord.js';

export default {
  name: 'avatar',
  description: 'Belirtilen kullanıcının avatarını gösterir',
  usage: '[@kullanıcı]',
  aliases: ['pp', 'pfp', 'profilresmi'],
  cooldown: 5,
  category: 'eglence',
  
  async execute(message, args, client) {
    // Hedef kullanıcıyı belirle (etiketlenen kullanıcı ya da komut yazarı)
    const targetUser = message.mentions.users.first() || 
                     (args[0] ? await client.users.fetch(args[0]).catch(() => message.author) : message.author);
    
    // Avatar URL'si (yüksek çözünürlüklü)
    const avatarURL = targetUser.displayAvatarURL({ 
      size: 4096, 
      dynamic: true 
    });
    
    // Avatar embed'i
    const avatarEmbed = new EmbedBuilder()
      .setColor('#2F3136')
      .setTitle(`${targetUser.tag}'in avatarı`)
      .setImage(avatarURL)
      .setDescription(`[Avatar Bağlantısı](${avatarURL})`)
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    // Kullanıcı bot ise veya özel bir avatar varsa belirt
    if (targetUser.bot) {
      avatarEmbed.addFields({ name: 'Bot', value: '✅ Bu kullanıcı bir bot!' });
    }
    
    if (message.guild && message.guild.members.cache.has(targetUser.id)) {
      const member = message.guild.members.cache.get(targetUser.id);
      
      // Sunucuya özel avatarı varsa
      if (member.avatar) {
        const serverAvatar = member.displayAvatarURL({
          size: 4096,
          dynamic: true
        });
        
        avatarEmbed.addFields({ 
          name: 'Sunucu Avatarı', 
          value: `[Bağlantı](${serverAvatar})` 
        });
      }
    }
    
    // Avatarın tipini belirt (gif, png, webp, vs)
    const avatarFormat = avatarURL.endsWith('.gif') ? 'GIF' : 
                         avatarURL.endsWith('.webp') ? 'WEBP' : 
                         avatarURL.endsWith('.png') ? 'PNG' : 
                         avatarURL.endsWith('.jpg') ? 'JPG' : 'Bilinmiyor';
    
    avatarEmbed.addFields({ name: 'Format', value: avatarFormat, inline: true });
    
    await message.channel.send({ embeds: [avatarEmbed] });
  },
}; 