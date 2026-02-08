import 'dotenv/config';

import { config } from 'dotenv';

import { AIBotsManager } from './bots/ai/ai-bot-manager.ts';
import { registerCommands } from './bots/telegram-bot/commands/factory/command-factory.ts';
import {
  setCommands,
  setUseCommands,
} from './bots/telegram-bot/commands/index.ts';
import { setUseMention } from './bots/telegram-bot/mention/index.ts';
import { TelegramBot } from './core/telegram-api/telegram-bot.ts';
import { applyAvatars } from './bots/telegram-bot/plugins/avatars/index.ts';
import { applyEmotionalDamage } from './bots/telegram-bot/plugins/emotional-damage/index.ts';
import { applyMassiveBan } from './bots/telegram-bot/plugins/massive-ban/index.ts';

config({ path: '.env.development' });

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const telegramBotApi = process.env.TELEGRAM_BOT_API;
  if (!telegramBotApi) {
    console.log('Telegram token is not found');
    return;
  }

  const bot = await TelegramBot.create(telegramBotApi, [
    'message',
    'inline_query',
  ]);
  const aiBotsManager = new AIBotsManager(bot);

  registerCommands(aiBotsManager);
  setUseCommands(bot);
  setCommands(bot);

  setUseMention(bot);

  bot.onUseMessage(applyAvatars);
  bot.onUseMessage(applyMassiveBan);
  bot.onUseMessage(applyEmotionalDamage);

  bot.start();
})();
