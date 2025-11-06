import type { BackgroundFillFreeformGradient } from './background-fill-free-form-gradient.ts';
import type { BackgroundFillGradient } from './background-fill-gradient.ts';
import type { BackgroundFillSolid } from './background-fill-solid.ts';

/**
 * @see https://core.telegram.org/bots/api#backgroundfill
 */
export type BackgroundFill =
  | BackgroundFillSolid
  | BackgroundFillGradient
  | BackgroundFillFreeformGradient;
