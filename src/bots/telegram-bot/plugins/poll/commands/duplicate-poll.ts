import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';
import type { CommandsFactoryItem } from '~/bots/telegram-bot/commands/factory/types.ts';
import { sendNegativeResult } from '~/bots/telegram-bot/common.ts';

import { createPollData, parsePollOptions } from './common.ts';

export const DuplicatePoll: CommandsFactoryItem = {
  label: 'Дублировать опрос',
  type: '/d_poll',
  handle: duplicatePoll,
  description: () => ({
    format: '/d_poll (можно добавить "Новое название" "Новый вариант 1" ...)',
    examples: [
      '/d_poll',
      '/d_poll "Новый опрос"',
      '/d_poll "Новый" "Вариант 1" "Вариант 2"',
    ],
    more: '<u>Требование:</u>\nОтветить на сообщение с опросом',
  })
};

async function duplicatePoll(data: CommandData, reply: Reply) {
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
    console.error('"d_poll" finished with error:', error);
    sendNegativeResult(reply, id, 'Произошла ошибка при создании опроса');
  }
}
