import { bansManager } from '~/core/moderation/bans-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

import { sendNegativeResult } from '../../common.ts';

export async function emotionalDamageOff(data: Update, reply: Reply) {
  const message = data.message;
  if (!message) {
    return;
  }

  try {
    const chat_id = message.chat.id;
    const reply_message = message.reply_to_message;
    if (!reply_message) {
      return sendNegativeResult(
        reply,
        chat_id,
        '💥 Нужно ответить на сообщение пользователя для пушистой амнистии! 🎯',
      );
    }

    const user = reply_message.from;
    if (!user) {
      return sendNegativeResult(
        reply,
        chat_id,
        "ОЙ-ВЕЙ! 👀 Не вижу пользователя! Maybe he's in stealth mode? 🕵️",
      );
    }

    const hasBan = bansManager.getBanInfo(user.id);
    if (!hasBan) {
      return sendNegativeResult(
        reply,
        chat_id,
        `🚨 У ${user.username ?? user.first_name} нет бана! Emotional damage уже снят! 💫`,
      );
    }

    bansManager.unbanUser(user.id);
    await reply.sendMessage({
      chat_id: message.chat.id,
      parse_mode: 'HTML',
      text: `ПУШИСТАЯ АМНИСТИЯ! 🎉 <b>${user.username ?? user.first_name}</b> снова в игре! Let's gooo! Welcome back, бро! 💫`,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
}
