import 'dotenv/config';

import { config } from 'dotenv';

import { AIBotsManager } from './bots/ai/ai-bot-manager.ts';
import { applyEmotionalDamage } from './bots/telegram-bot/apply-emotional-damage.ts';
import { applyMassiveBan } from './bots/telegram-bot/apply-massive-ban.ts';
import { registerCommands } from './bots/telegram-bot/commands/factory/command-factory.ts';
import {
  setCommands,
  setUseCommands,
} from './bots/telegram-bot/commands/index.ts';
import { setUseMention } from './bots/telegram-bot/mention/index.ts';
import { onNewChatMemeber } from './bots/telegram-bot/new-chat-member.ts';
import { applyAvatars } from './bots/telegram-bot/plugins/avatars/apply-avatars.ts';
import { TelegramBot } from './core/telegram-api/telegram-bot.ts';

config({ path: '../.env' });

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
  bot.onMessage(onNewChatMemeber(bot.getBotInfo().id));

  bot.start();
})();
