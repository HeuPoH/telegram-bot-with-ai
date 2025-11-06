import type { Chat } from './chat.ts';

/**
 * @see https://core.telegram.org/bots/api#story
 */
export type Story = {
  /**
   * Chat that posted the story
   */
  chat: Chat;

  /**
   * Unique identifier for the story in the chat
   */
  id: number;
};
