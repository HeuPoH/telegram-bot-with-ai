import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import { Factory } from '~/services/factory/index.ts';

import { resetAIs } from '../ai/reset-ai.ts';
import { startAI } from '../ai/start-ai.ts';
import { stopAI } from '../ai/stop-ai.ts';
import { deleteMessage } from '../delete-message.ts';
import { help } from '../help.ts';
import { duplicatePoll } from '../poll-commands/duplicate-poll.ts';
import { queryPoll } from '../poll-commands/query-poll.ts';
import { stopPoll } from '../poll-commands/stop-poll.ts';
import type { CommandsFactoryItem } from './types.ts';

const factory = new Factory<CommandsFactoryItem>();

export function registerCommands(aiBotsManager: AIBotsManager) {
  factory.register('/start_ai', {
    label: 'Запустить AI бота',
    type: '/start_ai',
    handle: (data, reply) => startAI(data, reply, aiBotsManager),
  });

  factory.register('/reset_ais', {
    label: 'Остановить всех ботов',
    type: '/reset_ais',
    handle: (data, reply) => resetAIs(data, reply, aiBotsManager),
  });

  factory.register('/stop_ai', {
    label: 'Остановить бота',
    type: '/stop_ai',
    handle: (data, reply) => stopAI(data, reply, aiBotsManager),
  });

  factory.register('/query_poll', {
    label: 'Создать опрос',
    type: '/query_poll',
    handle: queryPoll,
    description: () => ({
      format:
        '/query_poll "Название опроса" "Вариант 1" "Вариант 2" "Вариант 2"',
      examples: '/query_poll "Лучший язык?" "Python" "JavaScript" "Rust"',
    }),
  });

  factory.register('/stop_poll', {
    label: 'Закрыть опрос',
    type: '/stop_poll',
    handle: stopPoll,
    description: () => ({
      format: '/stop_poll',
      more: '<u>Требование:</u>\nответить на сообщение с опросом',
    }),
  });

  factory.register('/duplicate_poll', {
    label: 'Дублировать опрос',
    type: '/duplicate_poll',
    handle: duplicatePoll,
    description: () => ({
      format:
        '/duplicate_poll (можно добавить "Новое название" "Новый вариант 1" ...)',
      examples:
        '/duplicate_poll \n/duplicate_poll "Новый опрос" \n/duplicate_poll "Новый" "Вариант 1" "Вариант 2"',
      more: '<u>Требование:</u>\nответить на сообщение с опросом',
    }),
  });

  factory.register('/delete_message', {
    label: 'Удаление сообщения',
    type: '/delete_message',
    handle: deleteMessage,
    description: () => ({
      format: '/delete_message',
      more: '<u>Требование:</u> \n 1. бот должен иметь права на удаление сообщений \n 2. ответить на сообщение для удаления',
    }),
  });

  factory.register('/help', {
    label: 'Справка',
    type: '/help',
    handle: (data, reply) => help(data, reply, factory),
  });
}

export { factory };
