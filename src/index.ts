import 'dotenv/config';

import { config } from 'dotenv';

import { AIBotsManager } from './bots/ai/ai-bot-manager.ts';
import { applyEmotionalDamage } from './bots/telegram-bot/apply-emotional-damage.ts';
import { registerCommands } from './bots/telegram-bot/commands/factory/command-factory.ts';
import {
  setCommands,
  setUseCommands,
} from './bots/telegram-bot/commands/index.ts';
import { setUseMention } from './bots/telegram-bot/mention/index.ts';
import { onNewChatMemeber } from './bots/telegram-bot/new-chat-member.ts';
import { TelegramBot } from './core/telegram-api/telegram-bot.ts';

config({ path: '../.env' });

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const bot = await TelegramBot.create(process.env.TELEGRAM_BOT_API!, [
    'message',
    'inline_query',
  ]);
  const aiBotsManager = new AIBotsManager(bot);

  registerCommands(aiBotsManager);
  setUseCommands(bot);
  setCommands(bot);

  setUseMention(bot);

  bot.onUseMessage(applyEmotionalDamage);
  bot.onMessage(onNewChatMemeber(bot.getBotInfo().id));

  bot.start();
})();
