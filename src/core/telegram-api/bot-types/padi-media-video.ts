import type { Video } from './video.ts';

/**
 * @see https://core.telegram.org/bots/api#paidmediavideo
 */
export type PaidMediaVideo = {
  /**
   * Type of the paid media, always “video”
   */
  type: 'video';

  /**
   * The video
   */
  photo: Video[];
};
