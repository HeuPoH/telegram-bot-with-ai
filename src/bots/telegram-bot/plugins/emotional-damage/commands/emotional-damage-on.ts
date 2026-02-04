import type { CommandsFactoryItem } from '~/bots/telegram-bot/commands/factory/types.ts';
import { sendNegativeResult } from '~/bots/telegram-bot/common.ts';
import { bansManager } from '~/core/app-store.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

export const EmotionalDamageOn: CommandsFactoryItem = {
  label: 'Забанить',
  type: '/emotional_damage_on',
  handle: emotionalDamageOn,
  description: () => ({
    format: '/emotional_damage_on (можно добавить "duration")',
    more: '<u>Требование:</u>\nОтветить на сообщение пользователя для бана',
  }),
};

async function emotionalDamageOn(data: CommandData, reply: Reply) {
  const message = data.message;
  if (!message) {
    return;
  }

  const chat_id = message.chat.id;
  try {
    const reply_message = message.reply_to_message;
    if (!reply_message) {
      return sendNegativeResult(
        reply,
        chat_id,
        '🚨 Нужно ответить на сообщение цели для эмоционального дамага! 🎯',
      );
    }

    const [duration = 100] = data.command_args;
    const durationsNumber = Number(duration);
    if (Number.isNaN(durationsNumber)) {
      return sendNegativeResult(
        reply,
        chat_id,
        'Неверный формат времени! Нужны цифры, бро! 🔢',
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

    bansManager.banUser(user.id, durationsNumber);
    await reply.sendMessage({
      chat_id: message.chat.id,
      text: `Emotional damage is ACTIVATED! 🚨 Чувства ${user.username ?? user.first_name} получают критовый урон на ${duration} секунд! 💔🎯`,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `"emotional_damage_off" finished with error: ${error.message}`,
    );
    sendNegativeResult(reply, chat_id, 'Ошибка при запуске Emotional damage');
  }
}
