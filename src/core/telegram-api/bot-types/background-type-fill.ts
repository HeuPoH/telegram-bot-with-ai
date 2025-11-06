import type { BackgroundFill } from './background-fill.ts';

/**
 * @see https://core.telegram.org/bots/api#backgroundtypefill
 */
export type BackgroundTypeFill = {
  /**
   * Type of the background, always “fill”
   */
  type: 'fill';

  /**
   * The background fill
   */
  fill: BackgroundFill;

  /**
   * Dimming of the background in dark themes, as a percentage; 0-100
   */
  dark_theme_dimming: number;
};
