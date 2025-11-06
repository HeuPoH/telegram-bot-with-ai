import type { CallbackQuery } from './callback-query.ts';
import type { ChosenInlineResult } from './chosen-inline-result.ts';
import type { InlineQuery } from './inline-query.ts';
import type { Message } from './message.ts';
import type { MessageReactionCountUpdated } from './message-reaction-count-updated.ts';
import type { MessageReactionUpdated } from './message-reaction-updated.ts';
import type { Poll } from './poll.ts';
import type { PollAnswer } from './poll-answer.ts';
import type { AtMostOne } from './utils.ts';

/**
 * @see https://core.telegram.org/bots/api#update
 */
export type EventTypes = {
  /**
   * New incoming message of any kind - text, photo, sticker, etc.
   */
  message: Message;

  /**
   * New version of a message that is known to the bot and was edited. This update may at times be triggered by changes
   * to message fields that are either unavailable or not actively used by your bot.
   */
  edited_message: Message;

  /**
   * New incoming channel post of any kind - text, photo, sticker, etc.
   */
  channel_post: Message;

  /**
   * New version of a channel post that is known to the bot and was edited. This update may at times be triggered by
   * changes to message fields that are either unavailable or not actively used by your bot.
   */
  edited_channel_post: Message;

  /**
   * A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly
   * specify "message_reaction" in the list of allowed_updates to receive these updates. The update isn't received for
   * reactions set by bots.
   */
  message_reaction: MessageReactionUpdated;

  /**
   * Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must
   * explicitly specify "message_reaction_count" in the list of allowed_updates to receive these updates. The updates
   * are grouped and can be sent with delay up to a few minutes.
   */
  message_reaction_count: MessageReactionCountUpdated;

  /**
   * New incoming inline query
   */
  inline_query: InlineQuery;

  /**
   * The result of an inline query that was chosen by a user and sent to their chat partner. Please see our
   * documentation on the feedback collecting for details on how to enable these updates for your bot.
   */
  chosen_inline_result: ChosenInlineResult;

  /**
   * New incoming callback query
   */
  callback_query: CallbackQuery;

  /**
   * New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot
   */
  poll: Poll;

  /**
   * A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot
   * itself.
   */
  poll_answer: PollAnswer;
};

/**
 * @see https://core.telegram.org/bots/api#update
 */
export type UpdateType = keyof EventTypes;

/**
 * @see https://core.telegram.org/bots/api#update
 */
export type Update = {
  update_id: number;
} & AtMostOne<{
  [K in UpdateType]: EventTypes[K];
}>;
