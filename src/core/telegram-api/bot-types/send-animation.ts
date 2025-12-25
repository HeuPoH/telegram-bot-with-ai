import type { ReplyParameters } from './reply-parameters.ts';

/**
 * @see https://core.telegram.org/bots/api#sendanimation
 */
export type SendAnimation = {
  chat_id: string | number;
  animation: string;
  width?: number;
  height?: number;
  duration?: number;
  reply_parameters?: ReplyParameters;
};
