import type { Poll } from '~/core/telegram-api/bot-types/poll.ts';
import type { SendPoll } from '~/core/telegram-api/bot-types/send-poll.ts';

interface PollOptions {
  question?: string;
  options?: string[];
}

export function parsePollOptions(args: string[]): PollOptions {
  const [question, ...options] = args;

  if (!question && options.length === 0) {
    return {};
  }

  return {
    ...(question && { question }),
    ...(options.length > 0 && { options }),
  };
}

export function createPollData(
  originalPoll: Poll,
  { question, options }: PollOptions,
  chat_id: number,
): SendPoll {
  const pollData: SendPoll = {
    chat_id,
    question: question ?? originalPoll.question,
    options: originalPoll.options.map(opt => ({ text: opt.text })),
    is_anonymous: false,
    allows_multiple_answers: originalPoll.allows_multiple_answers,
    type: originalPoll.type,
  };

  if (options) {
    validateOptionsCount(options);
    pollData.options = options.map(text => ({ text }));
  }

  return pollData;
}

export function validateOptionsCount(options: string[]): void {
  const MAX_OPTIONS = 10;
  if (options.length > MAX_OPTIONS) {
    throw new Error(`Слишком много вариантов ответа. Максимум: ${MAX_OPTIONS}`);
  }
}
