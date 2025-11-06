/**
 * @see https://core.telegram.org/bots/api#backgroundtypechattheme
 */
export type BackgroundTypeChatTheme = {
  /**
   * Type of the background, always “chat_theme”
   */
  type: 'chat_theme';

  /**
   * Name of the chat theme, which is usually an emoji
   */
  theme_name: string;
};
