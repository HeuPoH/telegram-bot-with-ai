import type { Reply } from '../../core/telegram-api/bot-types/reply.ts';
import type { Update } from '../../core/telegram-api/bot-types/update.ts';

export interface BaseAIBot {
  message(update: Update, reply: Reply): void;
}
