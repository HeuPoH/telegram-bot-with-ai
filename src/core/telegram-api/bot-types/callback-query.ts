import type { MaybeInaccessibleMessage } from './maybe-in-accessible-message.ts';
import type { User } from './user.ts';

/**
 * @see https://core.telegram.org/bots/api#callbackquery
 */
export type CallbackQuery = {
  /**
   * Unique identifier for this query
   */
  id: string;

  /**
   * Sender
   */
  from: User;

  /**
   * Optional. Message sent by the bot with the callback button that originated the query
   */
  message?: MaybeInaccessibleMessage;

  /**
   * Optional. Identifier of the message sent via the bot in inline mode, that originated the query.
   */
  inline_message_id?: string;

  /**
   * Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent.
   * Useful for high scores in games.
   */
  chat_instance: string;

  /**
   * Optional. Data associated with the callback button. Be aware that the message originated the query can contain no
   * callback buttons with this data.
   */
  data?: string;

  /**
   * Optional. Short name of a Game to be returned, serves as the unique identifier for the game
   */
  game_short_name?: string;
};
