import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

export function onNewChatMemeber(botId: number) {
  return async (update: Update, reply: Reply) => {
    const message = update.message;
    if (!message) {
      return;
    }

    const newMember = message.new_chat_members?.[0];
    if (!newMember) {
      return;
    }

    try {
      if (botId === newMember.id) {
        await reply.sendMessage({
          chat_id: message.chat.id,
          text: 'Щётка? Нет, не слышал. А вот опросы — моя пушистая специальность! Только что приземлился в вашем чате. Готовьте пальцы для кликов! 🎲',
        });
      }
    } catch (error: unknown) {
      console.error('"new_chat_member" throw error:', error);
    }
  };
}
