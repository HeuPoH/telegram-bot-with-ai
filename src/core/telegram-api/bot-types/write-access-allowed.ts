/**
 * @see https://core.telegram.org/bots/api#writeaccessallowed
 */
export type WriteAccessAllowed = {
  /**
   * True, if the user can write custom messages
   */
  from_request?: boolean;

  /**
   * Optional. Name of the Web App, if the access was granted when the Web App was launched from a link
   */
  web_app_name?: string;

  /**
   * Optional. True, if the access was granted when the bot was added to the attachment or side menu
   */
  from_attachment_menu?: boolean;
};
