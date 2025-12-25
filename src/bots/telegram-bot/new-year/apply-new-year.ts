import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

import { getStrategyReply } from './reply-by-user-avatar.ts';
import { UsersStorage } from './users-storage.ts';

export function applyNewYear(update: Update, reply: Reply) {
  const message = update.message;
  if (!message) {
    return false;
  }

  const userId = message.from?.id;
  if (!userId) {
    return false;
  }

  const chat_id = message.chat.id;
  if (chat_id != +process.env.TARGET_CHAT_ID_FOR_NEW_YEAR!) {
    return false;
  }

  const strategyReply = getStrategyReply(message);
  if (!strategyReply) {
    console.warn('Strategy to reply is not found');
    return false;
  }

  reply
    .deleteMessage({
      chat_id,
      message_id: message.message_id,
    })
    .then(async () => {
      const userAvatars = await UsersStorage.getInstance();
      if (!userAvatars) {
        return;
      }

      const userAvatar = userAvatars.getUserAvatar(userId);
      return strategyReply(message, userAvatar.getApi());
    })
    .catch(() => {});

  return true;
}
