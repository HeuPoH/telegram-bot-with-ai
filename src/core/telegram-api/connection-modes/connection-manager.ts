import type { EventTypes, Update } from '../bot-types/update.ts';
import type { ITelegramApi } from '../telegram-api-service.ts';
import { LongPolling } from './long-polling.ts';

export interface BotConnection {
  start(): Promise<void>;
  stop(): void;
  isRunning(): boolean;
}

export class ConnectionManager {
  private botConnection: BotConnection;

  constructor(
    handler: (update: Update) => void,
    requestor: ITelegramApi,
    timeout: number,
    updateTypes: (keyof EventTypes)[],
  ) {
    this.botConnection = new LongPolling(
      handler,
      requestor,
      timeout,
      updateTypes,
    );
  }

  getConnection() {
    return this.botConnection;
  }
}
