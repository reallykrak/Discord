import prefixCommands from './prefixCommands.js';
import slashCommands from './slashCommands.js';
import events from './events.js';

export default async (client, commandType = 'both') => {
  try {
    await events(client);
    console.log('[HANDLER] Events loaded!');
    
    if (commandType === 'prefix' || commandType === 'both') {
      await prefixCommands(client);
      console.log('[HANDLER] Prefix commands loaded!');
    } else {
      console.log('[HANDLER] Prefix commands disabled by configuration!');
    }
    
    if (commandType === 'slash' || commandType === 'both') {
      await slashCommands(client);
      console.log('[HANDLER] Slash commands loaded and registered!');
    } else {
      console.log('[HANDLER] Slash commands disabled by configuration!');
    }
    
    console.log(`[INFO] All handlers loaded successfully! Command type: ${commandType}`);
  } catch (error) {
    console.error('[ERROR] Failed to load handlers:', error);
  }
}; 