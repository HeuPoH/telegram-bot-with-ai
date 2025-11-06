import type { Animation } from './animation.ts';
import type { MessageEntity } from './message-entity.ts';
import type { PhotoSize } from './photo-size.ts';

/**
 * @see https://core.telegram.org/bots/api#game
 */
export type Game = {
  /**
   * Title of the game
   */
  title: string;

  /**
   * Description of the game
   */
  description: string;

  /**
   * Photo that will be displayed in the game message in chats.
   */
  photo: PhotoSize[];

  /**
   * Optional. Brief description of the game or high scores included in the game message. Can be automatically edited
   * to include current high scores for the game when the bot calls setGameScore, or manually edited using
   * editMessageText. 0-4096 characters.
   */
  text?: string;

  /**
   * Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc.
   */
  text_entities?: MessageEntity[];

  /**
   * Optional. Animation that will be displayed in the game message in chats. Upload via BotFather
   */
  animation?: Animation;
};
