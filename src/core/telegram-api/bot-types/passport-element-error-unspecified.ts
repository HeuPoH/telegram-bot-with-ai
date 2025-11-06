import type { PassportElementErrorDataField } from './passport-element-error-data-field.ts';
import type { PassportElementErrorFile } from './passport-element-error-file.ts';
import type { PassportElementErrorFiles } from './passport-element-error-files.ts';
import type { PassportElementErrorFrontSide } from './passport-element-error-front-side.ts';
import type { PassportElementErrorReverseSide } from './passport-element-error-reverse-side.ts';
import type { PassportElementErrorSelfie } from './passport-element-error-selfie.ts';
import type { PassportElementErrorTranslationFile } from './passport-element-error-translation-file.ts';
import type { PassportElementErrorTranslationFiles } from './passport-element-error-translation-files.ts';

/**
 * ## PassportElementErrorUnspecified
 * Represents an issue in an unspecified place. The error is considered resolved when new data is added.
 * @see https://core.telegram.org/bots/api#passportelementerrorunspecified
 */
export type PassportElementErrorUnspecified = {
  /**
   * Error source, must be unspecified
   */
  source: 'unspecified';

  /**
   * Type of element of the user's Telegram Passport which has the issue
   */
  type: Extract<
    (
      | PassportElementErrorDataField
      | PassportElementErrorFrontSide
      | PassportElementErrorReverseSide
      | PassportElementErrorSelfie
      | PassportElementErrorFile
      | PassportElementErrorFiles
      | PassportElementErrorTranslationFile
      | PassportElementErrorTranslationFiles
    )['type'],
    string
  >;

  /**
   * Base64-encoded element hash
   */
  element_hash: string;

  /**
   * Error message
   */
  message: string;
};
