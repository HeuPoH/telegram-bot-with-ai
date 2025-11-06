import type { KeyboardButtonPollType } from './keyboard-button-poll-type.ts';
import type { KeyboardButtonRequestChat } from './keyboard-button-request-chat.ts';
import type { KeyboardButtonRequestUsers } from './keyboard-button-request-users.ts';
import type { AtMostOne } from './utils.ts';
import type { WebAppInfo } from './web-app-info.ts';

/**
 * @see https://core.telegram.org/bots/api#keyboardbutton
 */
export type KeyboardButton =
  | string
  | ({
      /**
       * Text of the button. If none of the optional fields are used, it will be sent as a message when the button is
       * pressed
       */
      text: string;
    } & Partial<
      AtMostOne<{
        /**
         * Optional. If specified, pressing the button will open a list of suitable users. Identifiers of selected users
         * will be sent to the bot in a “users_shared” service message. Available in private chats only.
         */
        request_users?: KeyboardButtonRequestUsers;

        /**
         * Optional. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send
         * its identifier to the bot in a “chat_shared” service message. Available in private chats only.
         */
        request_chat?: KeyboardButtonRequestChat;

        /**
         * Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in
         * private chats only.
         */
        request_contact?: boolean;

        /**
         * Optional. If True, the user's current location will be sent when the button is pressed. Available in private
         * chats only.
         */
        request_location?: boolean;

        /**
         * Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is
         * pressed. Available in private chats only.
         */
        request_poll?: KeyboardButtonPollType;

        /**
         * Optional. If specified, the described Web App will be launched when the button is pressed. The Web App will
         * be able to send a “web_app_data” service message. Available in private chats only.
         */
        web_app?: WebAppInfo;
      }>
    >);
