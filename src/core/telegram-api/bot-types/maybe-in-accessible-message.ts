import type { InaccessibleMessage } from './in-accessible-message.ts';
import type { Message } from './message.ts';

/**
 * @see https://core.telegram.org/bots/api#maybeinaccessiblemessage
 * */
export type MaybeInaccessibleMessage = Message | InaccessibleMessage;
