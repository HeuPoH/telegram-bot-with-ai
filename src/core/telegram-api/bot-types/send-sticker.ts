import type { ReplyParameters } from './reply-parameters.ts';

/**
 * @see https://core.telegram.org/bots/api#sendsticker
 */
export type SendSticker = {
  chat_id: string | number;
  sticker: string;
  emoji?: string;
  reply_parameters?: ReplyParameters;
};
