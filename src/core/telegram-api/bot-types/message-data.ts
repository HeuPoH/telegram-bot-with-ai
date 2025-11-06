import type { Chat } from './chat.ts';
import type { User } from './user.ts';

export type MessageData = {
  message: {
    message_id: number;
    from: User;
    chat: Chat;
    data: number;
    text: string;
  };
};
