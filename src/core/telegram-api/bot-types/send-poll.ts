import type { InputPollOption } from './input-poll-option.ts';
import type { MessageEntity } from './message-entity.ts';
import type { ReplyMarkup } from './reply-markup.ts';
import type { ReplyParameters } from './reply-parameters.ts';

/**
 * @see https://core.telegram.org/bots/api#sendpoll
 */
export type SendPoll = {
  business_connection_id?: string;
  chat_id: string | number;
  message_thread_id?: number;
  question: string;
  question_parse_mode?: string;
  question_entities?: MessageEntity[];
  options: InputPollOption[];
  is_anonymous: boolean;
  type?: 'quiz' | 'regular';
  allows_multiple_answers?: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_parse_mode?: string;
  explanation_entities?: MessageEntity[];
  open_period?: number;
  close_date?: number;
  is_closed?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
};
