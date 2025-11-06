import type { Message } from './message.ts';
import type { SuggestedPostPrice } from './suggested-post-price.ts';

/**
 * @see https://core.telegram.org/bots/api#suggestedpostapprovalfailed
 */
export type SuggestedPostApprovalFailed = {
  /**
   * Optional. Message containing the suggested post whose approval has failed. Note that the Message object in this
   * field will not contain the reply_to_message field even if it itself is a reply.
   */
  suggested_post_message?: Message;

  /**
   * Expected price of the post
   */
  price?: SuggestedPostPrice;
};
