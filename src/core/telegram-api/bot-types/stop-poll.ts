import type { InlineKeyboardMarkup } from './inline-keyboard-markup.ts';

export type StopPoll = {
  chat_id: number | string;
  message_id: number;
  reply_markup?: InlineKeyboardMarkup;
};
