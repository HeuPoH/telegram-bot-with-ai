import { delay } from '~/utils/delay.ts';

import type { EventTypes, Update } from '../bot-types/update.ts';
import type { ITelegramApi } from '../telegram-api-service.ts';
import { CustomTelegramResponseError } from './../custom-telegram-response-error.ts';
import type { BotConnection } from './connection-manager.ts';
import { shouldStopPermanently } from './utils.ts';

const MAX_RETRY_DELAY = 10_000;
const MAX_TRY_COUNT = 3;

export class LongPolling implements BotConnection {
  private abortController?: AbortController;
  private running = false;
  private offset = 0;
  private retryCount = 0;

  constructor(
    private handler: (update: Update) => void,
    private requestor: ITelegramApi,
    private timeout: number,
    private updateTypes: (keyof EventTypes)[],
  ) {}

  async start() {
    if (this.running) {
      console.log('Long polling is already running');
      return;
    }

    this.running = true;
    this.abortController = new AbortController();

    while (!this.abortController.signal.aborted) {
      try {
        await this.poll(this.abortController.signal);
        this.retryCount = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (
          error instanceof CustomTelegramResponseError &&
          shouldStopPermanently(error.getStatus())
        ) {
          console.log(error.message);
          this.stop();
          break;
        }

        const isRetry = await this.tryRestart();
        if (!isRetry) {
          this.stop();
          break;
        }
      }
    }
  }

  stop() {
    if (!this.running) {
      console.log('Long polling is not ruinning');
      return;
    }

    this.running = false;
    this.abortController?.abort();
    this.abortController = undefined;
  }

  isRunning(): boolean {
    return this.running;
  }

  private async tryRestart() {
    if (this.retryCount >= MAX_TRY_COUNT) {
      console.log('The number of attempts has ended');
      return false;
    }

    await delay(MAX_RETRY_DELAY);
    this.retryCount++;

    console.log(`Attempt is #${this.retryCount}`);
    return true;
  }

  private async poll(abortSignal: AbortSignal) {
    try {
      const updates = await this.requestor.getUpdates(
        {
          timeout: this.timeout,
          offset: this.offset,
          allowed_updates: this.updateTypes,
        },
        abortSignal,
      );

      for (const update of updates) {
        this.offset = update.update_id + 1;
        this.handler(update);
      }
    } catch (error) {
      console.error(`poll got error: ${error}`);
      throw error;
    }
  }
}
