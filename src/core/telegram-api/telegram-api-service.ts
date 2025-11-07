import type { ChatMember } from './bot-types/chat-member.ts';
import type { DeleteMessage } from './bot-types/delete-message.ts';
import type { DeleteMessages } from './bot-types/delete-messages.ts';
import type { GetUpdatesOptions } from './bot-types/get-update-options.ts';
import type { SuccessResponse } from './bot-types/response.ts';
import type { SendMessage } from './bot-types/send-message.ts';
import type { SendPoll } from './bot-types/send-poll.ts';
import type { StopPoll } from './bot-types/stop-poll.ts';
import type { Update } from './bot-types/update.ts';
import type { User } from './bot-types/user.ts';

export interface ITelegramApi {
  sendPoll(data: SendPoll): Promise<SuccessResponse>;
  stopPoll(data: StopPoll): Promise<SuccessResponse>;
  deleteMessage(data: DeleteMessage): Promise<SuccessResponse>;
  deleteMessages(data: DeleteMessages): Promise<SuccessResponse>;
  getChatMember(data: ChatMember): Promise<SuccessResponse>;
  sendMessage(data: SendMessage): Promise<SuccessResponse>;
  getMe(): Promise<User>;
  getUpdates(
    options: GetUpdatesOptions,
    abortSignal?: AbortSignal,
  ): Promise<Update[]>;
}

export type ITelegramApiMethods = keyof ITelegramApi;
