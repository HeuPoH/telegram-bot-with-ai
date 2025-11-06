import type { TelegramBotEventHandlers } from '~/core/telegram-api/bot-types/telegram-bot-event-handlers.ts';
import type { TelegramBot } from '~/core/telegram-api/telegram-bot.ts';

import { checkBan } from '../common.ts';
import { factory } from './factory/command-factory.ts';

export function setCommands(bot: TelegramBot) {
  const commands = factory.getAllRegistered();
  for (const command of commands) {
    bot.onCommand(`${command.type}`, command.handle);
  }
}

export function setUseCommands(bot: TelegramBotEventHandlers) {
  bot.onUseCommand(checkBan);
}
