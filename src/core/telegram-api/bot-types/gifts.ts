import type { Gift } from './gift.ts';

/**
 * @see https://core.telegram.org/bots/api#gifts
 */
export type Gifts = {
  /**
   * The list of gifts
   */
  gifts: Gift[];
};
