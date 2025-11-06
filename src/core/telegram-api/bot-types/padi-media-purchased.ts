import type { User } from './user.ts';

/**
 * @see https://core.telegram.org/bots/api#paidmediapurchased
 */
export type PaidMediaPurchased = {
  /**
   * User who purchased the media
   */
  from: User;

  /**
   * Bot-specified paid media payload
   */
  paid_media_payload: string;
};
