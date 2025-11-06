import type { PassportElementErrorDataField } from './passport-element-error-data-field.ts';
import type { PassportElementErrorFile } from './passport-element-error-file.ts';
import type { PassportElementErrorFiles } from './passport-element-error-files.ts';
import type { PassportElementErrorFrontSide } from './passport-element-error-front-side.ts';
import type { PassportElementErrorReverseSide } from './passport-element-error-reverse-side.ts';
import type { PassportElementErrorSelfie } from './passport-element-error-selfie.ts';
import type { PassportElementErrorTranslationFile } from './passport-element-error-translation-file.ts';
import type { PassportElementErrorTranslationFiles } from './passport-element-error-translation-files.ts';
import type { PassportElementErrorUnspecified } from './passport-element-error-unspecified.ts';

/**
 * ## PassportElementError
 * This object represents an error in the Telegram Passport element which was submitted that should be resolved by the
 * user. It should be one of:
 * - PassportElementErrorDataField
 * - PassportElementErrorFrontSide
 * - PassportElementErrorReverseSide
 * - PassportElementErrorSelfie
 * - PassportElementErrorFile
 * - PassportElementErrorFiles
 * - PassportElementErrorTranslationFile
 * - PassportElementErrorTranslationFiles
 * - PassportElementErrorUnspecified
 * @see https://core.telegram.org/bots/api#passportelementerror
 */
export type PassportElementError =
  | PassportElementErrorDataField
  | PassportElementErrorFrontSide
  | PassportElementErrorReverseSide
  | PassportElementErrorSelfie
  | PassportElementErrorFile
  | PassportElementErrorFiles
  | PassportElementErrorTranslationFile
  | PassportElementErrorTranslationFiles
  | PassportElementErrorUnspecified;
