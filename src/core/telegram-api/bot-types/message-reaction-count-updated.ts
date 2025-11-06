import type { Chat } from './chat.ts';
import type { ReactionCount } from './reaction-count.ts';

/**
 * @see https://core.telegram.org/bots/api#messagereactioncountupdated
 */
export type MessageReactionCountUpdated = {
  /**
   * The chat containing the message
   */
  chat: Chat;

  /**
   * Unique message identifier inside the chat
   */
  message_id: number;

  /**
   * Date of the change in Unix time
   */
  date: number;

  /**
   * List of reactions that are present on the message
   */
  reactions: ReactionCount[];
};
