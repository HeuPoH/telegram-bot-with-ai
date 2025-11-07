import { Factory } from '~/services/factory/index.ts';

import type { BaseAIBot } from '../base-ai-bot.ts';
import { FuzzyGunnerBot } from '../bot-entities/fuzzy-gunner-bot.ts';
import type { BotContext } from './types.ts';

export type BotType = 'fuzzy-gunner';

type FactoryItem = {
  label: string;
  type: BotType;
  createBot: (context: BotContext) => BaseAIBot;
};

const factory = new Factory<FactoryItem>();

factory.register('fuzzy-gunner', {
  label: 'Poll creator',
  type: 'fuzzy-gunner',
  createBot: (context: BotContext) => new FuzzyGunnerBot(context),
});

export { factory };
