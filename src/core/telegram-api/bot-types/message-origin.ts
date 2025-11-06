import type { MessageOriginChannel } from './message-origin-channel.ts';
import type { MessageOriginChat } from './message-origin-chat.ts';
import type { MessageOriginHiddenUser } from './message-origin-hidden-user.ts';
import type { MessageOriginUser } from './message-origin-user.ts';

/**
 * @see https://core.telegram.org/bots/api#messageorigin
 */
export type MessageOrigin =
  | MessageOriginUser
  | MessageOriginHiddenUser
  | MessageOriginChat
  | MessageOriginChannel;
