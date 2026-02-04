import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';
import { sendNegativeResult } from '~/bots/telegram-bot/common.ts';
import type { CommandsFactoryItem } from '~/bots/telegram-bot/commands/factory/types.ts';

import { parsePollOptions } from './common.ts';

export const QueryPoll: CommandsFactoryItem = {
  label: 'Создать опрос',
  type: '/q_poll',
  handle: queryPoll,
  description: () => ({
    format:
      '/q_poll [-a] "Название опроса" "Вариант 1" "Вариант 2" "Вариант 3"',
    examples: [
      '/q_poll "Лучший язык?" "Python" "JavaScript" "Rust"',
      '/q_poll -a "Анонимный опрос" "Да" "Нет" "Возможно"',
    ],
    flags: [
      [
        '-a',
        'Сделать опрос анонимным (без отображения имен проголосовавших)',
      ],
    ],
  })
};

async function queryPoll(data: CommandData, reply: Reply) {
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
    console.error('"q_poll" finished with error:', error);
    sendNegativeResult(reply, chat_id, 'Произошла ошибка при создании опроса');
  }
}
