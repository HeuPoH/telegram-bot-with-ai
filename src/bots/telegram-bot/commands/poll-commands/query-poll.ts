import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult } from '../../common.ts';
import { parsePollOptions } from './common.ts';

export async function queryPoll(data: CommandData, reply: Reply) {
  if (!data.message) {
    return;
  }

  const chat_id = data.message.chat.id;
  try {
    const poll = parsePollOptions(data.command_args);
    if (Object.keys(poll).length === 0) {
      return;
    }

    await reply.deleteMessage({
      chat_id,
      message_id: data.message.message_id,
    });

    const is_anonymous = data.command_flags.a === true;
    await reply.sendPoll({
      chat_id,
      question: poll.question!,
      options: poll.options!.map(text => ({ text })),
      is_anonymous,
    });
  } catch (error: unknown) {
    console.error('Failed to create poll:', error);
    sendNegativeResult(reply, chat_id, 'Произошла ошибка при создании опроса');
  }
}
