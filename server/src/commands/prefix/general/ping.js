export default {
  name: 'ping',
  description: 'Bot ve Discord API gecikme süresini gösterir',
  aliases: ['ms', 'latency'],
  usage: '',
  cooldown: 5,
  guildOnly: false,
  args: false,
  execute(message, args, client) {
    message.channel.send('Ping ölçülüyor...').then(sent => {
      const pingTime = sent.createdTimestamp - message.createdTimestamp;
      sent.edit(`🏓 Pong!\nBot gecikmesi: ${pingTime}ms\nAPI gecikmesi: ${client.ws.ping}ms`);
    });
  },
}; 