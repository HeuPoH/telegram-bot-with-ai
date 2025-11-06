import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import { CustomTelegramResponseError } from '~/core/telegram-api/custom-telegram-response-error.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult } from '../common.ts';

export async function deleteMessage(data: CommandData, reply: Reply) {
  try {
    await deleteMessageHandle(data, reply);
  } catch (error: unknown) {
    deleteMessageError(data, reply, error);
  }
}

function deleteMessageHandle(data: CommandData, reply: Reply) {
  if (!data.message) {
    return;
  }

  const { reply_to_message } = data.message;
  if (!reply_to_message) {
    return;
  }

  const { message_id, chat } = reply_to_message;
  return reply.deleteMessage({
    chat_id: chat.id,
    message_id: message_id,
  });
}

function deleteMessageError(data: CommandData, reply: Reply, error: unknown) {
  const chat_id = data.message!.chat.id;
  if (error instanceof CustomTelegramResponseError) {
    sendNegativeResult(reply, chat_id, error.message);
  } else if (error instanceof Error) {
    sendNegativeResult(reply, chat_id, error.message);
  }
  console.error('Failed to delete message:', error);
}
