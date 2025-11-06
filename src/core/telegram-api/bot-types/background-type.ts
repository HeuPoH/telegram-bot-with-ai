import type { BackgroundTypeChatTheme } from './background-type-chat-theme.ts';
import type { BackgroundTypeFill } from './background-type-fill.ts';
import type { BackgroundTypePattern } from './background-type-pattern.ts';
import type { BackgroundTypeWallpaper } from './background-type-wallpaper.ts';

/**
 * @see https://core.telegram.org/bots/api#backgroundtype
 */
export type BackgroundType =
  | BackgroundTypeFill
  | BackgroundTypeWallpaper
  | BackgroundTypePattern
  | BackgroundTypeChatTheme;
