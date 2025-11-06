import type { CommandData } from '../observers/commands.ts';
import type { Handle, UseHandle } from '../observers/generic-observable.ts';
import type { Update } from './update.ts';

export interface TelegramBotEventHandlers {
  onCommand(command: string, cb: Handle<CommandData>): void;
  onUseCommand(cb: UseHandle<Update>): void;
  offCommand(command: string, cb: Handle<CommandData>): void;
  onMention(cb: Handle<Update>): void;
  offMention(cb: Handle<Update>): void;
  onUseMention(cb: UseHandle<Update>): void;
  onMessage(cb: Handle<Update>): void;
  offMessage(cb: Handle<Update>): void;
}
