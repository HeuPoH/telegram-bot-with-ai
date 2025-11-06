import type { Reply } from '../bot-types/reply.ts';
import type { Update } from '../bot-types/update.ts';
import { GenericObservable } from './generic-observable.ts';

export const MENTION_KEY = 'mention';

export class Mentions extends GenericObservable<Update> {
  notify(update: Update, reply: Reply) {
    if (!update.message?.text) {
      return;
    }

    this.notifyImpl(MENTION_KEY, update, reply);
  }
}
