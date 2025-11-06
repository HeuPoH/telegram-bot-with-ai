import type { Mistral } from '@mistralai/mistralai';
import type { AssistantMessage } from '@mistralai/mistralai/models/components/assistantmessage.js';
import type { ChatCompletionResponse } from '@mistralai/mistralai/models/components/chatcompletionresponse.js';
import type { SystemMessage } from '@mistralai/mistralai/models/components/systemmessage.js';
import type { ToolMessage } from '@mistralai/mistralai/models/components/toolmessage.js';
import type { UserMessage } from '@mistralai/mistralai/models/components/usermessage.js';

import type { BaseAIBot } from './base-ai-bot.ts';

export type Message =
  | (SystemMessage & { role: 'system' })
  | (ToolMessage & { role: 'tool' })
  | (UserMessage & { role: 'user' })
  | (AssistantMessage & { role: 'assistant' });

export interface BotSession {
  token: string;
  bot: BaseAIBot;
  model: string;
  client: Mistral;
  handle: Promise<ChatCompletionResponse> | undefined;
  abortController: AbortController | undefined;
}
