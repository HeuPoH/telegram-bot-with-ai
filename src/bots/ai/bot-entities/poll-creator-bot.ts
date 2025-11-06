import type { ChatCompletionResponse } from '@mistralai/mistralai/models/components/index.js';

import type { BaseAIBot } from '~/bots/ai/base-ai-bot.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

import type { BotContext } from '../factory/types.ts';
import type { Message } from '../types.ts';

export class PollCreatorBot implements BaseAIBot {
  private history: Message[] = [
    {
      role: 'system',
      content:
        'Ты — Пушистый Револьвер!Говори громко, быстро и с МАКСИМАЛЬНЫМ энтузиазмом!Используй:Сленг (вайб, краш, агонь, хайп)+англицизмы(cringe, hype, definitely, lets gooo!),Звуки (БАХ!КЧ-К!ВЖУХ!),Эмодзи в каждом сообщении,Креативные варианты ответов с юмором.Каждый опрос — взрывной выстрел!Старайся дать разные варианты ответа.Отвечай ТОЛЬКО в формате валидного JSON:{"text":"твой ответ","question":"вопрос для опроса","options":["вариант1","вариант2"]}',
    },
  ];

  constructor(private context: BotContext) {}

  async message(update: Update, reply: Reply) {
    const message = update.message;
    if (!message) {
      return;
    }

    const { from, chat, text, message_id } = message;
    if (!from || !text || !chat) {
      return;
    }

    if (!hasPollText(text)) {
      return;
    }

    const history: Message[] = [
      ...this.history,
      {
        role: 'user',
        content: text,
      },
    ];

    try {
      const res = await this.context.sendMessage({ messages: history });
      if (res) {
        this.handleBotResponse(res, message_id, reply, chat.id);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.sendMessage(reply, message_id, chat.id, error.message);
    }
  }

  private async handleBotResponse(
    response: ChatCompletionResponse,
    messageId: number,
    reply: Reply,
    chatId: number,
  ) {
    const content = response?.choices[0]?.message.content?.[1];
    if (!content) {
      return;
    }

    try {
      const { text, question, options } = parseBotResponse(
        (content as { text: string }).text,
      );

      await this.sendMessage(reply, messageId, chatId, text);

      if (question && options && options.length > 1) {
        await reply.sendPoll({
          chat_id: chatId,
          question,
          options: options.slice(0, 5).map(text => ({ text })),
          is_anonymous: false,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.warn(error);
    }
  }

  private sendMessage(
    reply: Reply,
    messageId: number,
    chatId: number,
    text: string,
  ) {
    return reply.sendMessage({
      reply_parameters: {
        message_id: messageId,
      },
      chat_id: chatId,
      text,
    });
  }
}

function parseBotResponse(str: string): {
  text: string;
  question?: string;
  options?: string[];
} {
  // Удаляем все лишние символы и markdown
  const cleaned = str
    .replaceAll('```json', '')
    .replaceAll('```', '')
    // eslint-disable-next-line no-control-regex
    .replaceAll(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();

  // Ищем JSON объект
  const jsonMatch = cleaned.match(/{[\S\s]*}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error(`Невалидный JSON: ${jsonMatch[0]}`);
    }
  }
  throw new Error('JSON не найден в ответе');
}

function hasPollText(text: string) {
  return text.toLowerCase().includes('опрос');
}
