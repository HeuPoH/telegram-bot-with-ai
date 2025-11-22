import axios from 'axios';

import type { ChatMember } from './bot-types/chat-member.ts';
import type { DeleteMessage } from './bot-types/delete-message.ts';
import type { DeleteMessages } from './bot-types/delete-messages.ts';
import type { GetUpdatesOptions } from './bot-types/get-update-options.ts';
import type { Response, SuccessResponse } from './bot-types/response.ts';
import type { SendAnimation } from './bot-types/send-animation.ts';
import type { SendMessage } from './bot-types/send-message.ts';
import type { SendPoll } from './bot-types/send-poll.ts';
import type { StopPoll } from './bot-types/stop-poll.ts';
import type { Update } from './bot-types/update.ts';
import type { User } from './bot-types/user.ts';
import { CustomTelegramResponseError } from './custom-telegram-response-error.ts';
import type { ITelegramApi } from './telegram-api-service.ts';

/**
 * Реализация клиента для работы с Telegram Bot API
 * Обеспечивает отправку запросов к API Telegram и обработку ответов
 */
export class TelegramApi implements ITelegramApi {
  private readonly baseUrl;

  /**
   * Создает экземпляр TelegramApi
   * @param token - Токен бота, полученный от @BotFather
   */
  constructor(token: string) {
    this.baseUrl = 'https://api.telegram.org/bot' + token;
  }

  /**
   * Получает обновления (новые сообщения и события) от Telegram API
   * @param options - Параметры для получения обновлений
   * @param abortSignal - Сигнал отмены для прерывания запроса
   * @returns Promise с массивом обновлений или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * const updates = await api.getUpdates({ offset: 0, limit: 10 });
   */
  async getUpdates(options: GetUpdatesOptions, abortSignal?: AbortSignal) {
    const response = await this.makeRequest(
      this.buildUrl('getUpdates'),
      options,
      abortSignal,
    );
    return response?.result as Update[];
  }

  /**
   * Отправляет анимацию (GIF или видео без звука)
   * @param data - Объект с данными для отправки анимации
   * @returns Promise с результатом отправки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * // Отправка анимации по file_id
   * await api.sendAnimation({
   *   chat_id: 12345,
   *   animation: 'CgACAgQAAxkBAAMOZJ...'
   * });
   *
   * @example
   * // Отправка анимации по URL с дополнительными параметрами
   * await api.sendAnimation({
   *   chat_id: 12345,
   *   animation: 'https://example.com/animation.gif',
   *   duration: 5,
   *   width: 320,
   *   height: 240
   * });
   */
  sendAnimation(data: SendAnimation): Promise<SuccessResponse> {
    return this.makeRequest(this.buildUrl('sendAnimation'), data);
  }

  /**
   * Отправляет текстовое сообщение
   * @param data - Данные для отправки сообщения
   * @returns Promise с результатом отправки или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * await api.sendMessage({
   *   chat_id: 12345,
   *   text: 'Привет, мир!'
   * });
   */
  sendMessage(data: SendMessage) {
    return this.makeRequest(this.buildUrl('sendMessage'), data);
  }

  /**
   * Отправляет опрос (голосование)
   * @param data - Данные для создания опроса
   * @returns Promise с результатом отправки или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * await api.sendPoll({
   *   chat_id: 12345,
   *   question: 'Ваш любимый язык?',
   *   options: ['JavaScript', 'TypeScript', 'Python']
   * });
   */
  sendPoll(data: SendPoll) {
    return this.makeRequest(this.buildUrl('sendPoll'), data);
  }

  /**
   * Останавливает активный опрос
   * @param data - Данные для остановки опроса
   * @returns Promise с результатом операции или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * await api.stopPoll({
   *   chat_id: 12345,
   *   message_id: 67890
   * });
   */
  stopPoll(data: StopPoll) {
    return this.makeRequest(this.buildUrl('stopPoll'), data);
  }

  /**
   * Удаляет сообщение в чате
   * @param data - Данные для удаления сообщения
   * @returns Promise с результатом операции или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * await api.deleteMessage({
   *   chat_id: 12345,
   *   message_id: 67890
   * });
   */
  deleteMessage(data: DeleteMessage) {
    return this.makeRequest(this.buildUrl('deleteMessage'), data);
  }

  /**
   * Удаляет несколько сообщений в чате
   * @param data - Данные для удаления сообщений
   * @returns Promise с результатом операции или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @example
   * await api.deleteMessages({
   *   chat_id: 12345,
   *   message_ids: [67890, 67891, 67892]
   * });
   */
  deleteMessages(data: DeleteMessages) {
    return this.makeRequest(this.buildUrl('deleteMessages'), data);
  }

  /**
   * Получает информацию о боте
   * @returns Promise с информацией о боте
   * @throws {Error} Если не удалось получить или распарсить ответ
   * @example
   * const botInfo = await api.getMe();
   * console.log(`Бот: ${botInfo.first_name} (@${botInfo.username})`);
   */
  async getMe(): Promise<User> {
    try {
      const response = await axios({
        method: 'GET',
        url: this.buildUrl('getMe'),
        responseType: 'text',
        transitional: {
          silentJSONParsing: false,
          forcedJSONParsing: false,
        },
        validateStatus: () => true,
      });

      const parsedData = JSON.parse(response.data.toString()) as Response;
      if (!parsedData.ok) {
        throw new CustomTelegramResponseError(
          parsedData.description,
          parsedData.error_code,
        );
      }

      return parsedData.result as User;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof CustomTelegramResponseError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Error(`Telegram API request failed: ${error.message}`);
      }

      throw new Error('Unknown error');
    }
  }

  getChatMember(data: ChatMember) {
    return this.makeRequest(this.buildUrl('getChatMember'), data);
  }

  /**
   * Выполняет HTTP-запрос к API Telegram
   * @param url - Полный URL для запроса
   * @param options - Параметры запроса
   * @param abortSignal - Сигнал отмены запроса
   * @returns Promise с ответом API или undefined в случае ошибки
   * @throws {CustomTelegramResponseError} Если API Telegram вернуло ошибку
   * @private
   */
  private async makeRequest(
    url: string,
    options?: Record<string, unknown>,
    abortSignal?: AbortSignal,
  ) {
    try {
      const response = await axios({
        method: 'POST',
        url,
        data: options,
        responseType: 'text',
        signal: abortSignal,
        transitional: {
          silentJSONParsing: false,
          forcedJSONParsing: false,
        },
        validateStatus: () => true,
      });

      const parsedData = JSON.parse(response.data.toString()) as Response;
      if (!parsedData.ok) {
        throw new CustomTelegramResponseError(
          parsedData.description,
          parsedData.error_code,
        );
      }

      return parsedData as SuccessResponse;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof CustomTelegramResponseError) {
        throw error;
      }

      if ('code' in error) {
        throw new Error(`Telegram API request failed: ${error.code}`);
      }

      throw new Error('Unknown error');
    }
  }

  /**
   * Строит полный URL для вызова метода API
   * @param method - Название метода API
   * @returns Полный URL для запроса
   * @private
   */
  private buildUrl(method: string) {
    return `${this.baseUrl}/${method}`;
  }
}
