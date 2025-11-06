import type { UniqueGiftBackdropColors } from './unique-gift-backdrop-colors.ts';

/**
 * @see https://core.telegram.org/bots/api#uniquegiftbackdrop
 */
export type UniqueGiftBackdrop = {
  /**
   * Name of the backdrop
   */
  name: string;

  /**
   * Colors of the backdrop
   */
  colors: UniqueGiftBackdropColors;

  /**
   * The number of unique gifts that receive this backdrop for every 1000 gifts upgraded
   */
  rarity_per_mille: number;
};
