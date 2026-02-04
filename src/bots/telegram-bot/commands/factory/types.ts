import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';
import type { IFactory } from '~/services/factory/index.ts';

export type Description = {
  format: string;
  examples?: string[];
  more?: string;
  flags?: string[][];
};

export type CommandsFactoryItem = {
  label: string;
  type: `/${string}`;
  handle: (data: CommandData, reply: Reply) => void;
  description?: () => Description;
};

export type ICommandsFactory = IFactory<CommandsFactoryItem>;
