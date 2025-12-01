import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import { Factory } from '~/services/factory/index.ts';

import { resetAIs } from '../ai/reset-ai.ts';
import { startAI } from '../ai/start-ai.ts';
import { stopAI } from '../ai/stop-ai.ts';
import { deleteMessage } from '../delete-message.ts';
import { emotionalDamageOff } from '../emotional-damage/emotional-damage-off.ts';
import { emotionalDamageOn } from '../emotional-damage/emotional-damage-on.ts';
import { helloKitty } from '../hello-kitty.ts';
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
    description: () => ({
      format: '/start_ai',
    }),
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
    description: () => ({
      format: '/stop_ai',
    }),
  });

  factory.register('/q_poll', {
    label: 'Создать опрос',
    type: '/q_poll',
    handle: queryPoll,
    description: () => ({
      format: '/q_poll "Название опроса" "Вариант 1" "Вариант 2" "Вариант 2"',
      examples: '/q_poll "Лучший язык?" "Python" "JavaScript" "Rust"',
    }),
  });

  factory.register('/s_poll', {
    label: 'Закрыть опрос',
    type: '/s_poll',
    handle: stopPoll,
    description: () => ({
      format: '/s_poll',
      more: '<u>Требование:</u>\nОтветить на сообщение с опросом',
    }),
  });

  factory.register('/d_poll', {
    label: 'Дублировать опрос',
    type: '/d_poll',
    handle: duplicatePoll,
    description: () => ({
      format: '/d_poll (можно добавить "Новое название" "Новый вариант 1" ...)',
      examples:
        '/d_poll \n/d_poll "Новый опрос" \n/d_poll "Новый" "Вариант 1" "Вариант 2"',
      more: '<u>Требование:</u>\nОтветить на сообщение с опросом',
    }),
  });

  factory.register('/d_message', {
    label: 'Удаление сообщения',
    type: '/d_message',
    handle: deleteMessage,
    description: () => ({
      format: '/d_message',
      more: '<u>Требование:</u>\n1. бот должен иметь права на удаление сообщений \n2. ответить на сообщение для удаления',
    }),
  });

  factory.register('/emotional_damage_on', {
    label: 'Забанить',
    type: '/emotional_damage_on',
    handle: emotionalDamageOn,
    description: () => ({
      format: '/emotional_damage_on (можно добавить "duration")',
      more: '<u>Требование:</u>\nОтветить на сообщение пользователя для бана',
    }),
  });

  factory.register('/emotional_damage_off', {
    label: 'Разбанить',
    type: '/emotional_damage_off',
    handle: emotionalDamageOff,
    description: () => ({
      format: '/emotional_damage_off',
      more: '<u>Требование:</u>\nОтветить на сообщение пользователя для разбана',
    }),
  });

  factory.register('/help', {
    label: 'Справка',
    type: '/help',
    handle: (data, reply) => help(data, reply, factory),
  });

  factory.register('/hello_kitty', {
    label: 'Массовый бан',
    type: '/hello_kitty',
    handle: helloKitty,
  });
}

export { factory };
