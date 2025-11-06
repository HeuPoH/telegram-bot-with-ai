import type { ReactionType } from './reaction-type.ts';

/**
 * @see https://core.telegram.org/bots/api#reactioncount
 */
export type ReactionCount = {
  /**
   * Type of the reaction
   */
  type: ReactionType;

  /**
   * Number of times the reaction was added
   */
  total_count: number;
};
