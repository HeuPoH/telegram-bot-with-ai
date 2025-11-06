/**
 * @see https://core.telegram.org/bots/api#messageautodeletetimerchanged
 */
export type MessageAutoDeleteTimerChanged = {
  /**
   * New auto-delete time for messages in the chat; in seconds
   */
  message_auto_delete_time: number;
};
