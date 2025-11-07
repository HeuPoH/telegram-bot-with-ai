import type { ITelegramApi } from '../telegram-api-service.ts';

export type Reply = Pick<
  ITelegramApi,
  | 'sendPoll'
  | 'sendMessage'
  | 'stopPoll'
  | 'deleteMessage'
  | 'getMe'
  | 'getChatMember'
>;
