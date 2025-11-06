import type { ChatCompletionResponse } from '@mistralai/mistralai/models/components/chatcompletionresponse.js';

import type { Message } from '../types.ts';

export type MessageOptions = {
  messages: Message[];
};

export type BotContext = {
  sendMessage(
    options: MessageOptions,
  ): Promise<ChatCompletionResponse | undefined> | undefined;
};
