import type { Ban } from './types.ts';

/**
 * Менеджер для управления временными блокировками пользователей
 * Предоставляет методы для добавления, удаления и проверки блокировок с автоматическим учетом времени истечения
 */
class BansManager {
  private bans = new Map<number, Ban>();

  /**
   * Блокирует пользователя на указанный период времени
   * @param userId - Уникальный идентификатор пользователя для блокировки
   * @param durationSeconds - Длительность блокировки в секундах
   * @param reason - Причина блокировки (опционально)
   * @returns Объект с информацией о созданной блокировке
   * @example
   * // Заблокировать пользователя на 1 час за нарушение правил
   * const banInfo = bansManager.banUser(12345, 3600, 'Нарушение правил чата');
   * console.log(`Блокировка истекает: ${new Date(banInfo.finishTime)}`);
   */
  banUser(userId: number, durationSeconds: number, reason?: string) {
    const startTime = Date.now();
    const ban = {
      startTime,
      durationSeconds,
      finishTime: startTime + durationSeconds * 1000,
      reason,
    };
    this.bans.set(userId, ban);
    return ban;
  }

  /**
   * Снимает блокировку с пользователя досрочно
   * @param userId - Уникальный идентификатор пользователя для разблокировки
   * @returns true если пользователь был заблокирован и разблокирован, false если пользователь не был заблокирован
   * @example
   * // Разблокировать пользователя
   * const wasBanned = bansManager.unbanUser(12345);
   * if (wasBanned) {
   *   console.log('Пользователь разблокирован');
   * }
   */
  unbanUser(userId: number) {
    return this.bans.delete(userId);
  }

  /**
   * Проверяет активен ли бан пользователя в данный момент
   * Автоматически удаляет истекшие блокировки при проверке
   * @param userId - Уникальный идентификатор пользователя для проверки
   * @returns true если пользователь заблокирован и бан еще активен, false если нет или блокировка истекла
   * @example
   * if (bansManager.checkUserBan(12345)) {
   *   console.log('Пользователь заблокирован');
   * } else {
   *   console.log('Пользователь не заблокирован');
   * }
   */
  checkUserBan(userId: number) {
    const ban = this.bans.get(userId);
    if (!ban) {
      return false;
    }

    const isBanActive = Date.now() < ban.finishTime;
    if (!isBanActive) {
      this.unbanUser(userId);
      return false;
    }

    return true;
  }

  /**
   * Получает детальную информацию о текущей блокировке пользователя
   * @param userId - Уникальный идентификатор пользователя
   * @returns Объект с информацией о блокировке или undefined если пользователь не заблокирован или блокировка истекла
   * @example
   * const banInfo = bansManager.getBanInfo(12345);
   * if (banInfo) {
   *   console.log(`Причина: ${banInfo.reason}`);
   *   console.log(`Длительность: ${banInfo.durationSeconds} секунд`);
   *   console.log(`Истекает: ${new Date(banInfo.finishTime)}`);
   * }
   */
  getBanInfo(userId: number) {
    return this.checkUserBan(userId) ? this.bans.get(userId) : undefined;
  }
}

export const bansManager = new BansManager();
