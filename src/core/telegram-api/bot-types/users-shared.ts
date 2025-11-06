import type { SharedUser } from './shared-user.ts';

/**
 * @see https://core.telegram.org/bots/api#usersshared
 */
export type UsersShared = {
  /**
   * Identifier of the request
   */
  request_id: number;

  /**
   * Information about users shared with the bot.
   */
  users: SharedUser[];
};
