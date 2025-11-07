import { bansManager } from '~/core/moderation/bans-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

export function applyEmotionalDamage(data: Update, reply: Reply) {
  const message = data.message;
  if (!message) {
    return false;
  }

  const user = message.from;
  if (!user) {
    return false;
  }

  const hasBan = bansManager.checkUserBan(user.id);
  const chatId = message.chat.id;
  if (hasBan) {
    reply
      .deleteMessage({
        chat_id: chatId,
        message_id: message.message_id,
      })
      .then(() => {
        reply.sendMessage({
          chat_id: chatId,
          parse_mode: 'HTML',
          text: `💥 АЛЕРТ!\n<b>${user.username ?? user.first_name}</b> пытается прорваться через банхаммер!✋\nВот что хотел выстрелить наш бан-изгой:\n<tg-spoiler>${message.text ?? ''}</tg-spoiler>`,
        });
      })
      .catch(() => {
        console.error('Failed to apply emotional damage');
      });
    return true;
  }

  return false;
}
