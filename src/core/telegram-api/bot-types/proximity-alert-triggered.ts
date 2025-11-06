import type { User } from './user.ts';

/**
 * @see https://core.telegram.org/bots/api#proximityalerttriggered
 */
export type ProximityAlertTriggered = {
  /**
   * User that triggered the alert
   */
  traveler: User;

  /**
   * User that set the alert
   */
  watcher: User;

  /**
   * The distance between the users
   */
  distance: number;
};
