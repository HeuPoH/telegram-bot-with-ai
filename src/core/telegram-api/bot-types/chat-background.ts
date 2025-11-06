import type { BackgroundType } from './background-type.ts';

/**
 * @see https://core.telegram.org/bots/api#chatbackground
 */
export type ChatBackground = {
  /**
   * Type of the background
   */
  type: BackgroundType;
};
