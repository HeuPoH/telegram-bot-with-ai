/**
 * @see https://core.telegram.org/bots/api#videochatscheduled
 */
export type VideoChatScheduled = {
  /**
   * Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator
   */
  start_date: number;
};
