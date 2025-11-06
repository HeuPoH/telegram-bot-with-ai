import { Factory } from '~/services/factory/index.ts';

import type { BaseAIBot } from '../base-ai-bot.ts';
import { PollCreatorBot } from '../bot-entities/poll-creator-bot.ts';
import type { BotContext } from './types.ts';

export type BotType = 'poll-creator';

type FactoryItem = {
  label: string;
  type: BotType;
  createBot: (context: BotContext) => BaseAIBot;
};

const factory = new Factory<FactoryItem>();

factory.register('poll-creator', {
  label: 'Poll creator',
  type: 'poll-creator',
  createBot: (context: BotContext) => new PollCreatorBot(context),
});

export { factory };
