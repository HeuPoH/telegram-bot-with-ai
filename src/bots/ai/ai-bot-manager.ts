import { Mistral } from '@mistralai/mistralai';

import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { Update } from '~/core/telegram-api/bot-types/update.ts';

import type { TelegramBotEventHandlers } from '../../core/telegram-api/bot-types/telegram-bot-event-handlers.ts';
import { type BotType, factory } from './factory/ai-bots-factory.ts';
import type { MessageOptions } from './factory/types.ts';
import type { BotSession } from './types.ts';

type StartBotArgs = {
  apiKey: string;
  botType: BotType;
  model: string;
};

export class AIBotsManager {
  private usedTokens = new Set<string>();
  // key = chatId
  private sessions: Record<string, BotSession> = {};
  private isConnectedToMessageFlow = false;

  constructor(private telegramBot: TelegramBotEventHandlers) {}

  startBot(chatId: string, { apiKey, botType, model }: StartBotArgs) {
    if (this.sessions[chatId]) {
      throw new Error(
        'Ой-ой! Кажется, я уже тут! 🚀 Пушистый Револьвер не может быть в двух местах одновременно!',
      );
    }

    if (this.usedTokens.has(apiKey)) {
      throw new Error(
        'Критический вайб-фриз! 🚨 Этот токен уже работает! Один токен — один выстрел! 💥',
      );
    }

    const botFactItem = factory.getRegistered(botType);
    if (!botFactItem) {
      throw new Error(`${botType} is not found`);
    }

    const client = new Mistral({ apiKey });
    const bot = botFactItem.createBot({
      sendMessage: data => this.sendMessage(chatId, data),
    });

    this.usedTokens.add(apiKey);
    this.sessions[chatId] = {
      client,
      model,
      bot,
      token: apiKey,
      handle: undefined,
      abortController: undefined,
    };

    this.connectToMessageFlow();
  }

  stopBot(chatId: string) {
    const session = this.sessions[chatId];
    if (!session) {
      throw new Error(
        'КРИНЖ! 🚨 Пушистый Револьвер на перезарядке! Сначала активируйте мой вайб! ⚡️',
      );
    }

    session.abortController?.abort();
    session.handle = undefined;
    this.usedTokens.delete(session.token);
    delete this.sessions[chatId];

    if (Object.keys(this.sessions).length === 0) {
      this.disconnectFromMessageFlow();
    }
  }

  resetBots() {
    const sessionKeys = Object.keys(this.sessions);
    for (const key of sessionKeys) {
      this.stopBot(key);
    }
  }

  private connectToMessageFlow() {
    if (this.isConnectedToMessageFlow) {
      return;
    }

    this.isConnectedToMessageFlow = true;
    this.telegramBot.onMention(this.onMentionHandle);
  }

  private disconnectFromMessageFlow() {
    if (!this.isConnectedToMessageFlow) {
      return;
    }

    this.isConnectedToMessageFlow = false;
    this.telegramBot.offMention(this.onMentionHandle);
  }

  private onMentionHandle = (update: Update, reply: Reply) => {
    const message = update.message;
    if (!message) {
      return;
    }

    const chatId = message.chat.id;
    this.sessions[`${chatId}`]?.bot.message(update, reply);
  };

  private sendMessage = (chatId: string, options: MessageOptions) => {
    const session = this.sessions[chatId];
    if (!session) {
      throw new Error(`${chatId} не найден`);
    }

    if (session.handle) {
      throw new Error('Предыдущий запрос еще не завершился');
    }

    const { messages } = options;
    session.abortController = new AbortController();
    session.handle = session.client.chat.complete(
      {
        model: session.model,
        messages,
      },
      { signal: session.abortController.signal },
    );

    return session.handle.finally(() => {
      session.handle = undefined;
      session.abortController = undefined;
    });
  };
}
