import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import { Factory } from '~/services/factory/index.ts';

import { ResetAIs } from '../../plugins/ai/reset-ai.ts';
import { StartAI } from '../../plugins/ai/start-ai.ts';
import { StopAI } from '../../plugins/ai/stop-ai.ts';
import { help } from '../help.ts';
import type { CommandsFactoryItem } from './types.ts';
import { AvatarsItem } from '../../plugins/avatars/index.ts';
import { EmotionalDamageOff, EmotionalDamageOn } from '../../plugins/emotional-damage/index.ts';
import { HelloKitty } from '../../plugins/massive-ban/index.ts';
import { DuplicatePoll, QueryPoll, StopPoll } from '../../plugins/poll/index.ts';

const factory = new Factory<CommandsFactoryItem>();

export function registerCommands(aiBotsManager: AIBotsManager) {
  const startAI = StartAI(aiBotsManager);
  factory.register(startAI.type, startAI);

  const resetAIs = ResetAIs(aiBotsManager);
  factory.register(resetAIs.type, resetAIs);

  const stopAI = StopAI(aiBotsManager);
  factory.register(stopAI.type, stopAI);

  factory.register(QueryPoll.type, QueryPoll);
  factory.register(StopPoll.type, StopPoll);
  factory.register(DuplicatePoll.type, DuplicatePoll);
  factory.register(EmotionalDamageOn.type, EmotionalDamageOn);
  factory.register(EmotionalDamageOff.type, EmotionalDamageOff);
  factory.register(HelloKitty.type, HelloKitty);
  factory.register(AvatarsItem.type, AvatarsItem);

  factory.register('/help', {
    label: 'Справка',
    type: '/help',
    handle: (data, reply) => help(data, reply, factory),
  });
}

export { factory };
