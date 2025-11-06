import type { UpdateType } from './update.ts';

export type GetUpdatesOptions = {
  offset?: number;
  limit?: number;
  timeout?: number;
  allowed_updates?: UpdateType[];
};
