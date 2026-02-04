import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

import { getStrategyReply } from './reply-by-user-avatar.ts';
import { UsersStorage } from './users-storage/users-storage.ts';
import { storeSettings } from './settings/settings.ts';

export function applyAvatars(update: Update, reply: Reply) {
  const message = update.message;
  if (!message) {
    return false;
  }

  const messageEntity = message.entities?.[0];
  if (messageEntity?.type === 'bot_command') {
    return false;
  }

  const from = message.from;
  if (!from) {
    return false;
  }

  const userId = from.id;
  if (!userId) {
    return false;
  }

  if (from.is_bot) {
    return false;
  }

  const chat_id = message.chat.id;
  if (`${chat_id}` !== storeSettings.getTargetChatId()) {
    return false;
  }

  const strategyReply = getStrategyReply(message);
  if (!strategyReply) {
    console.warn('Strategy to reply is not found');
    return false;
  }

  Promise.resolve()
    .then(() => {
      return reply.deleteMessage({
        chat_id,
        message_id: message.message_id,
      });
    })
    .then(async () => {
      const userAvatars = await UsersStorage.getInstance();
      if (!userAvatars) {
        return;
      }

      const userAvatar = userAvatars.getUserAvatar(userId);
      return strategyReply(message, userAvatar.getApi());
    })
    .catch(error => {
      console.error(`"apply_avatars" throw error: ${error}`);
    });

  return true;
}
