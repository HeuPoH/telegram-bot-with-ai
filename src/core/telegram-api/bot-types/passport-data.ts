import type { EncryptedCredentials } from './encrypted-credentials.ts';
import type { EncryptedPassportElement } from './encrypted-passport-element.ts';

/**
 * @see https://core.telegram.org/bots/api#passportdata
 */
export type PassportData = {
  /**
   * Array with information about documents and other Telegram Passport elements that was shared with the bot
   */
  data: EncryptedPassportElement[];

  /**
   * Encrypted credentials required to decrypt the data
   */
  credentials: EncryptedCredentials;
};
