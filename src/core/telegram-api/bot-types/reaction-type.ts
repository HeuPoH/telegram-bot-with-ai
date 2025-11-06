import type { ReactionTypeCustomEmoji } from './reaction-type-custom-emoji.ts';
import type { ReactionTypeEmoji } from './reaction-type-emoji.ts';
import type { ReactionTypePaid } from './reaction-type-paid.ts';

/**
 * @see https://core.telegram.org/bots/api#reactiontype
 */
export type ReactionType =
  | ReactionTypeEmoji
  | ReactionTypeCustomEmoji
  | ReactionTypePaid;
