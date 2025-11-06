import type { User } from './user.ts';

/**
 * @see https://core.telegram.org/bots/api#messageoriginuser
 */
export type MessageOriginUser = {
  /**
   * Type of the message origin, always “user”
   */
  type: 'user';

  /**
   * Date the message was sent originally in Unix time
   */
  date: number;

  /**
   * User that sent the message originally
   */
  sender_user: User;
};
