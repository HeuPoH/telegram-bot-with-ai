import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';
import type { IFactory } from '~/services/factory/index.ts';

export type Command =
  | 'query_poll'
  | 'stop_poll'
  | 'delete_message'
  | 'duplicate_poll'
  | 'help'
  | 'start_ai'
  | 'stop_ai'
  | 'reset_ais'
  | 'emotional_damage_on'
  | 'emotional_damage_off'
  | 'hello_kitty';

type Description = {
  format: string;
  examples?: string;
  more?: string;
};

export type CommandsFactoryItem = {
  label: string;
  type: `/${Command}`;
  handle: (data: CommandData, reply: Reply) => void;
  description?: () => Description;
};

export type ICommandsFactory = IFactory<CommandsFactoryItem>;
