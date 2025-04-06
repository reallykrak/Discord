import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Bot ve Discord API gecikmesini gösterir'),
  async execute(interaction, client) {
    await interaction.deferReply();
    
    const reply = await interaction.fetchReply();
    const pingTime = reply.createdTimestamp - interaction.createdTimestamp;
    
    await interaction.editReply({
      content: `🏓 Pong!\nBot gecikmesi: ${pingTime}ms\nAPI gecikmesi: ${client.ws.ping}ms`
    });
  },
}; 