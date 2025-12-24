import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult } from '../../common.ts';
import { createPollData, parsePollOptions } from './common.ts';

export async function duplicatePoll(data: CommandData, reply: Reply) {
  if (!data.message) {
    return;
  }

  const { id } = data.message.chat;
  try {
    const originalPoll = data.message.reply_to_message?.poll;
    if (!originalPoll) {
      sendNegativeResult(reply, id, 'Опрос не найден');
      return;
    }

    const pollOptions = parsePollOptions(data.command_args);
    const sendPollData = createPollData(originalPoll, pollOptions, id);

    await reply.deleteMessage({
      chat_id: id,
      message_id: data.message.message_id,
    });

    await reply.sendPoll(sendPollData);
  } catch (error) {
    console.error('Failed to duplicate poll:', error);
    sendNegativeResult(reply, id, 'Произошла ошибка при создании опроса');
  }
}
