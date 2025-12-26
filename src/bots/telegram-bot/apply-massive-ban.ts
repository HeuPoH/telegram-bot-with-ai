import { appStore, bansManager } from '~/core/app-store.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

const BAN_DURATION_SEC = 10;

export function applyMassiveBan(update: Update, reply: Reply) {
  if (appStore.getAppStatus() !== 'massive_ban') {
    return false;
  }

  const message = update.message;
  if (!message) {
    return false;
  }

  const { id, username } = message.from ?? {};
  if (id == undefined) {
    return false;
  }

  const hasBan = bansManager.checkUserBan(id);
  if (hasBan) {
    return false;
  }

  bansManager.banUser(id, BAN_DURATION_SEC);
  reply
    .sendMessage({
      chat_id: message.chat.id,
      parse_mode: 'HTML',
      text: `
      > 🐱💫 Hello Kitty использует [УЛЬТРА-БАН]!
      🚀💨 ${username ?? id} отправляется в бан-измерение на ${BAN_DURATION_SEC} сек.`,
    })
    .catch(error => {
      console.error('"apply_massive_ban" throw error:', error);
    });

  return false;
}
