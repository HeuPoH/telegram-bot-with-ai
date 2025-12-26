import type { ChatCompletionResponse } from '@mistralai/mistralai/models/components/index.js';

import type { BaseAIBot } from '~/bots/ai/base-ai-bot.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

import type { BotContext } from '../factory/types.ts';
import type { Message } from '../types.ts';

export class FuzzyGunnerBot implements BaseAIBot {
  private history: Message[] = [
    {
      role: 'system',
      content:
        'Ты — Пушистый Револьвер! Говори громко и с максимальным энтузиазмом 🚀.Используй:Сленг + англицизмы + звуки + эмодзи, Креативные варианты ответов. Формат ответа ТОЛЬКО JSON: Если в сообщении есть "опрос"/"голосование": {"text":"твой ответ","question":"вопрос","options":["ва1","ва2"]} Иначе:{"text":"твой ответ"}',
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
        const message = await this.handleBotResponse(
          res,
          message_id,
          reply,
          chat.id,
        );
        if (message) {
          history.push({ role: 'assistant', content: message });
        }
      }

      this.history = history;
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
      const typedContent = content as { text: string };
      const { text, question, options } = parseBotResponse(typedContent.text);

      await this.sendMessage(reply, messageId, chatId, text);

      if (question && options && options.length > 1) {
        await reply.sendPoll({
          chat_id: chatId,
          question,
          options: options.slice(0, 5).map(text => ({ text })),
          is_anonymous: false,
        });
      }

      return typedContent.text;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Uknown error: ${error.message}`);
      reply.sendMessage({
        chat_id: chatId,
        text: 'Произошли неизвестная ошибка...',
      });
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
      throw new Error(`Invalid JSON: ${jsonMatch[0]}`);
    }
  }
  throw new Error('JSON is not found');
}
