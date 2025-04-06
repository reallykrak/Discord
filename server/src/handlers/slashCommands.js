import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (client) => {
  const commands = [];
  const commandsPath = join(__dirname, '../commands/slash');
  
  try {
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const folderPath = join(commandsPath, folder);
      const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));
      
      for (const file of commandFiles) {
        const filePath = join(folderPath, file);
        const commandModule = await import(`file://${filePath}`);
        const command = commandModule.default;
        
        if ('data' in command && 'execute' in command) {
          client.slashCommands.set(command.data.name, command);
          commands.push(command.data.toJSON());
          console.log(`[SLASH] Loaded command: ${command.data.name}`);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }

    const rest = new REST().setToken(process.env.TOKEN);

    if (commands.length > 0) {
      try {
        console.log(`[INFO] Started refreshing ${commands.length} application (/) commands.`);

        let data;
        
        if (process.env.GUILD_ID) {
          data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
          );
          console.log(`[INFO] Successfully registered ${data.length} guild (/) commands.`);
        } else {
          data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
          );
          console.log(`[INFO] Successfully registered ${data.length} global (/) commands.`);
        }
      } catch (error) {
        console.error(`[ERROR] Failed to register slash commands:`, error);
      }
    } else {
      console.log(`[INFO] No slash commands to register.`);
    }

    client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;

      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
        }
      }
    });
  } catch (error) {
    console.error('[ERROR] Slash commands could not be loaded:', error);
  }
}; 