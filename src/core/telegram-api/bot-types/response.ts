import type { ResponseParameters } from './response-parameters.ts';

export interface SuccessResponse {
  ok: true;
  result: unknown;
  description?: string;
}
export interface ErrorResponse {
  ok: false;
  description: string;
  error_code: number;
  parameters?: ResponseParameters;
}

/**
 * @see https://core.telegram.org/bots/api#making-requests
 */
export type Response = SuccessResponse | ErrorResponse;
