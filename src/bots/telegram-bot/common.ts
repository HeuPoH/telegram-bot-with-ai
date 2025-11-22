import { bansManager } from '~/core/app-store.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Response } from '~/core/telegram-api/bot-types/response.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

export function sendNegativeResult(
  reply: Reply,
  chatId: number,
  desc?: string,
) {
  return reply.sendMessage({
    chat_id: chatId,
    text: desc ?? 'Unknown error',
  });
}

export function sendPositiveResult(reply: Reply, chatId: number, desc: string) {
  return reply.sendMessage({
    chat_id: chatId,
    text: desc,
  });
}

export function prepareSendResult(
  reply: Reply,
  chatId: number,
  positive: string,
) {
  return (result: Response) => {
    return result.ok
      ? sendPositiveResult(reply, chatId, positive)
      : sendNegativeResult(reply, chatId, result.description);
  };
}

export function checkBan(update: Update, reply: Reply) {
  const { message } = update;
  if (!message) {
    return false;
  }

  const { chat, from } = message;
  if (!from) {
    return false;
  }

  if (!bansManager.checkUserBan(from.id)) {
    return false;
  }

  const banInfo = bansManager.getBanInfo(from.id)!;
  reply.sendMessage({
    chat_id: chat.id,
    text: `${from.username} забанен до ${new Date(banInfo.finishTime)}`,
  });

  return true;
}
