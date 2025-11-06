import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { prepareSendResult, sendNegativeResult } from '../../common.ts';

export async function stopPoll(data: CommandData, reply: Reply): Promise<void> {
  const message = data.message;
  if (!message) {
    return;
  }

  const chat_id = data.message.chat.id;
  try {
    await handlePollStop(data, reply);
  } catch (error) {
    await handleStopPollError(error, reply, chat_id);
  }
}

async function handlePollStop(data: CommandData, reply: Reply): Promise<void> {
  const message = data.message;
  if (!message) {
    return;
  }

  const chat_id = data.message.chat.id;
  const originalPoll = data.message.reply_to_message?.poll;

  try {
    if (!originalPoll) {
      sendNegativeResult(reply, chat_id, 'Опрос не найден');
      return;
    }

    const { message_id, chat } = data.message.reply_to_message!;

    const stopResult = await reply.stopPoll({
      chat_id: chat.id,
      message_id,
    });

    const sendResult = prepareSendResult(
      reply,
      chat.id,
      `Опрос "${originalPoll.question}" закрыт`,
    );

    await sendResult(stopResult);
  } catch (error) {
    console.error('Failed to stop poll:', error);
    sendNegativeResult(reply, chat_id, 'Произошла ошибка при закрытии опроса');
  }
}

async function handleStopPollError(
  error: unknown,
  reply: Reply,
  chat_id: number,
): Promise<void> {
  console.error('Failed to stop poll:', error);
  sendNegativeResult(reply, chat_id, 'Не удалось закрыть опрос');
}
