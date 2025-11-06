import type { PhotoSize } from './photo-size.ts';

/**
 * @see https://core.telegram.org/bots/api#paidmediaphoto
 */
export type PaidMediaPhoto = {
  /**
   * Type of the paid media, always “photo”
   */
  type: 'photo';

  /**
   * The photo
   */
  photo: PhotoSize[];
};
