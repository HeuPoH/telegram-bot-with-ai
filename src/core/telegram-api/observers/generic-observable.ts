/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reply } from '../bot-types/reply.ts';
import type { Update } from '../bot-types/update.ts';

export type Handle<T = any> = (data: T, reply: Reply) => void;
export type UseHandle<T = any> = (data: T, reply: Reply) => boolean;

/**
 * Абстрактный базовый класс для реализации паттерна Наблюдатель
 * Предоставляет механизм регистрации, удаления и уведомления обработчиков событий
 * с поддержкой промежуточных обработчиков (middleware)
 * @template T - Тип данных, передаваемых обработчикам (по умолчанию: any)
 */
export abstract class GenericObservable<T = any> {
  protected observers = new Map<string, Handle<T>[]>();
  protected useHandlers: UseHandle<T>[] = [];

  /**
   * Абстрактный метод для уведомления наблюдателей о событии
   * Должен быть реализован в производных классах
   * @param update - Обновление от Telegram API
   * @param reply - Интерфейс для отправки ответов
   */
  abstract notify(update: Update, reply: Reply): void;

  /**
   * Регистрирует промежуточный обработчик (middleware)
   * Промежуточные обработчики выполняются до основных наблюдателей
   * и могут прервать цепочку обработки, вернув true
   * @param callback - Функция-обработчик, возвращающая true для прерывания цепочки
   * @example
   * observable.use((data, reply) => {
   *   console.log('Processing data:', data);
   *   return false; // Продолжить обработку
   * });
   */
  use(callback: UseHandle<T>) {
    this.useHandlers.push(callback);
  }

  /**
   * Регистрирует обработчик для конкретного ключа
   * @param key - Ключ для группировки обработчиков (например, название команды)
   * @param observer - Функция-обработчик, вызываемая при уведомлении
   * @example
   * observable.register('start', (data, reply) => {
   *   reply.sendMessage(data.chat.id, 'Command received');
   * });
   */
  register(key: string, observer: Handle<T>) {
    const obs = this.observers.get(key);
    if (obs) {
      obs.push(observer);
    } else {
      this.observers.set(key, [observer]);
    }
  }

  /**
   * Удаляет обработчик для конкретного ключа
   * @param key - Ключ, для которого удаляется обработчик
   * @param observer - Функция-обработчик для удаления
   * @example
   * const handler = (data, reply) => { ... };
   * observable.register('start', handler);
   * // Позже...
   * observable.unregister('start', handler);
   */
  unregister(key: string, observer: Handle<T>) {
    const obs = this.observers.get(key);
    if (!obs) {
      return;
    }

    const nextObs = obs.filter(cb => cb !== observer);
    if (nextObs.length > 1) {
      this.observers.set(key, nextObs);
    } else {
      this.observers.delete(key);
    }
  }

  /**
   * Реализует логику уведомления обработчиков для конкретного ключа
   * Сначала выполняет промежуточные обработчики, затем основные наблюдатели
   * @param key - Ключ, для которого вызываются обработчики
   * @param data - Данные для передачи обработчикам
   * @param reply - Интерфейс для отправки ответов
   * @protected
   */
  protected notifyImpl(key: string, data: T, reply: Reply) {
    // Выполняем промежуточные обработчики
    const isStop = this.useHandlers.some(cb => cb(data, reply));
    if (isStop) {
      return; // Прерываем выполнение, если один из обработчиков вернул true
    }

    // Вызываем все зарегистрированные обработчики для ключа
    // eslint-disable-next-line unicorn/no-array-for-each
    this.observers.get(key)?.forEach(cb => cb(data, reply));
  }
}
