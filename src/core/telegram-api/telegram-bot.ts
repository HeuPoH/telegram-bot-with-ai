/* eslint-disable unicorn/no-array-for-each */
import type { MessageEntity } from './bot-types/message-entity.ts';
import type { TelegramBotEventHandlers } from './bot-types/telegram-bot-event-handlers.ts';
import type { EventTypes, Update } from './bot-types/update.ts';
import type { User } from './bot-types/user.ts';
import { ConnectionManager } from './connection-modes/connection-manager.ts';
import { type CommandData, Commands } from './observers/commands.ts';
import type {
  GenericObservable,
  Handle,
  UseHandle,
} from './observers/generic-observable.ts';
import { MENTION_KEY, Mentions } from './observers/mention.ts';
import { TelegramApi } from './telegram-api.ts';
import type { ITelegramApi } from './telegram-api-service.ts';

type EntityHandles = { [K in MessageEntity['type']]?: GenericObservable };

/**
 * Основной класс для работы с Telegram Bot API
 * Предоставляет методы для обработки сообщений, команд, упоминаний и управления ботом
 * Реализует паттерн наблюдателя для различных типов сущностей сообщений
 */
export class TelegramBot implements TelegramBotEventHandlers {
  private api: ITelegramApi;
  private connectionManager: ConnectionManager;
  private botInfo: User = {
    id: -1,
    is_bot: true,
    first_name: 'Bot',
  };

  private messageHandles: ((update: Update) => void)[] = [];
  private entityHandles: EntityHandles = {
    bot_command: new Commands(),
    mention: new Mentions(),
  };

  /**
   * Создает и инициализирует новый экземпляр TelegramBot
   * @param token - Токен бота, полученный от @BotFather
   * @returns Promise с инициализированным экземпляром бота
   * @example
   * const bot = await TelegramBot.create('YOUR_BOT_TOKEN');
   */
  static async create(token: string, updateTypes: (keyof EventTypes)[]) {
    const bot = new TelegramBot(token, updateTypes);
    await bot.init();
    return bot;
  }

  /**
   * Приватный конструктор для создания экземпляра бота
   * @param token - Токен бота для доступа к Telegram API
   * @private
   */
  private constructor(token: string, updateTypes: (keyof EventTypes)[]) {
    this.api = new TelegramApi(token);
    this.connectionManager = new ConnectionManager(
      this.handleMessage,
      this.api,
      2000,
      updateTypes,
    );
  }

  /**
   * Инициализирует бота, получая информацию о нем от Telegram API
   * Заполняет данные о боте (ID, имя, username и т.д.)
   * @private
   */
  async init() {
    try {
      const botInfo = await this.api.getMe();
      this.botInfo = botInfo;
    } catch {
      console.error('Getting bot information was failed');
    }
  }

  /**
   * Регистрирует обработчик для конкретной команды
   * @param command - Название команды (без слеша)
   * @param cb - Функция-обработчик команды, принимающая данные команды и интерфейс для ответа
   * @example
   * bot.onCommand('start', (data, reply) => {
   *   reply.sendMessage(data.chat.id, 'Добро пожаловать!');
   * });
   */
  onCommand(command: string, cb: Handle<CommandData>) {
    this.entityHandles.bot_command?.register(command, cb);
  }

  /**
   * Регистрирует промежуточный обработчик для команд бота
   * Промежуточные обработчики выполняются до основных обработчиков упоминаний
   * и могут прервать цепочку обработки, вернув true
   * @param cb - Функция-обработчик, возвращающая true для прерывания цепочки обработки
   * @example
   * bot.onUseCommand((update, reply) => {
   *   // Проверяем, имеет ли пользователь право использовать бота
   *   if (!isUserAllowed(update.message.from.id)) {
   *     reply.sendMessage(update.message.chat.id, 'Доступ запрещен');
   *     return true; // Прерываем выполнение последующих обработчиков
   *   }
   *   return false; // Продолжаем обработку
   * });
   */
  onUseCommand(cb: UseHandle<Update>): void {
    this.entityHandles.mention?.use(cb);
  }

  /**
   * Удаляет обработчик для конкретной команды
   * @param command - Название команды (без слеша)
   * @param cb - Функция-обработчик команды для удаления
   * @example
   * const handler = (data, reply) => { ... };
   * bot.onCommand('start', handler);
   * // Позже...
   * bot.offCommand('start', handler);
   */
  offCommand(command: string, cb: Handle<CommandData>) {
    this.entityHandles.bot_command?.unregister(command, cb);
  }

  /**
   * Регистрирует обработчик для всех входящих сообщений
   * @param cb - Функция-обработчик сообщений, принимающая обновление и интерфейс для ответа
   * @example
   * bot.onMessage((update, reply) => {
   *   if (update.message?.text) {
   *     reply.sendMessage(update.message.chat.id, 'Сообщение получено');
   *   }
   * });
   */
  onMessage(cb: Handle<Update>) {
    this.messageHandles.push(data => cb(data, this.api));
  }

  /**
   * Удаляет обработчик для входящих сообщений
   * @param cb - Функция-обработчик сообщений для удаления
   * @example
   * const handler = (update, reply) => { ... };
   * bot.onMessage(handler);
   * // Позже...
   * bot.offMessage(handler);
   */
  offMessage(cb: Handle<Update>) {
    this.messageHandles = this.messageHandles.filter(c => c !== cb);
  }

  /**
   * Регистрирует промежуточный обработчик для упоминаний бота
   * Промежуточные обработчики выполняются до основных обработчиков упоминаний
   * и могут прервать цепочку обработки, вернув true
   * @param cb - Функция-обработчик, возвращающая true для прерывания цепочки обработки
   * @example
   * bot.onUseMention((update, reply) => {
   *   // Проверяем, имеет ли пользователь право использовать бота
   *   if (!isUserAllowed(update.message.from.id)) {
   *     reply.sendMessage(update.message.chat.id, 'Доступ запрещен');
   *     return true; // Прерываем выполнение последующих обработчиков
   *   }
   *   return false; // Продолжаем обработку
   * });
   */
  onUseMention(cb: UseHandle<Update>) {
    this.entityHandles.mention?.use(cb);
  }

  /**
   * Регистрирует обработчик для упоминаний бота в сообщениях
   * @param cb - Функция-обработчик упоминаний, принимающая обновление и интерфейс для ответа
   * @example
   * bot.onMention((update, reply) => {
   *   reply.sendMessage(update.message.chat.id, 'Вы обратились ко мне!');
   * });
   */
  onMention(cb: Handle<Update>) {
    this.entityHandles.mention?.register(MENTION_KEY, cb);
  }

  /**
   * Удаляет обработчик для упоминаний бота
   * @param cb - Функция-обработчик упоминаний для удаления
   * @example
   * const handler = (update, reply) => { ... };
   * bot.onMention(handler);
   * // Позже...
   * bot.offMention(handler);
   */
  offMention(cb: Handle<Update>) {
    this.entityHandles.mention?.unregister(MENTION_KEY, cb);
  }

  /**
   * Запускает бота и начинает прослушивание входящих обновлений
   * Активирует менеджер соединений для получения обновлений от Telegram API
   * @example
   * bot.start();
   * console.log('Бот запущен');
   */
  start() {
    this.connectionManager.getConnection().start();
  }

  /**
   * Останавливает бота и прекращает прослушивание входящих обновлений
   * Деактивирует менеджер соединений
   * @example
   * bot.stop();
   * console.log('Бот остановлен');
   */
  stop() {
    this.connectionManager.getConnection().stop();
  }

  /**
   * Проверяет, запущен ли бот в данный момент
   * @returns true если бот запущен и прослушивает обновления, false в противном случае
   * @example
   * if (bot.isRunning()) {
   *   console.log('Бот активен');
   * }
   */
  isRunning() {
    return this.connectionManager.getConnection().isRunning();
  }

  getBotInfo() {
    return this.botInfo;
  }

  /**
   * Основной обработчик входящих сообщений
   * Распределяет обновления по соответствующим обработчикам сущностей и сообщений
   * @param update - Входящее обновление от Telegram API
   * @private
   */
  private handleMessage = (update: Update) => {
    try {
      // Определяем тип сущности в сообщении и уведомляем соответствующий обработчик
      const messageType = getTelegramUpdateType(update);
      if (messageType) {
        this.entityHandles[messageType]?.notify(update, this.api);
      }

      // Вызываем все зарегистрированные обработчики сообщений
      this.messageHandles.forEach(cb => cb(update));
    } catch {
      console.warn('Unhandled error in handleMessage');
    }
  };
}

/**
 * Определяет тип сущности в полученном обновлении
 * Анализирует первую сущность в сообщении для определения типа контента
 * @param update - Обновление от Telegram API
 * @returns Тип сущности (bot_command, mention и т.д.) или undefined если сущность не найдена
 */
function getTelegramUpdateType(update: Update) {
  return update.message ? update.message.entities?.[0]?.type : undefined;
}
