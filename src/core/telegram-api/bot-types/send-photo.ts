import type { ReplyParameters } from './reply-parameters.ts';

/**
 * @see https://core.telegram.org/bots/api#sendphoto
 */
export type SendPhoto = {
  chat_id: string | number;
  photo: string;
  caption?: string;
  reply_parameters?: ReplyParameters;
};
