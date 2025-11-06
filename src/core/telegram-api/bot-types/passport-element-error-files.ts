export type PassportElementErrorFiles = {
  /**
   * Error source, must be files
   */
  source: 'files';

  /**
   * The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”,
   * “rental_agreement”, “passport_registration”, “temporary_registration”
   */
  type:
    | 'utility_bill'
    | 'bank_statement'
    | 'rental_agreement'
    | 'passport_registration'
    | 'temporary_registration';

  /**
   * List of base64-encoded file hashes
   */
  file_hashes: string[];

  /**
   * Error message
   */
  message: string;
};
