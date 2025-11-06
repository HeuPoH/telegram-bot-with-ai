import type { ForceReply } from './force-reply.ts';
import type { InlineKeyboardMarkup } from './inline-keyboard-markup.ts';
import type { ReplyKeyboardMarkup } from './reply-keyboard-markup.ts';
import type { ReplyKeyboardRemove } from './reply-keyboard-remove.ts';

export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply;
