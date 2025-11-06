import type { TelegramBotEventHandlers } from '~/core/telegram-api/bot-types/telegram-bot-event-handlers.ts';

import { checkBan } from '../common.ts';

export function setUseMention(bot: TelegramBotEventHandlers) {
  bot.onUseMention(checkBan);
}
