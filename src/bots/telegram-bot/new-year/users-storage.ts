import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { UserAvatarBotsStorage } from './user-avatar-bots-storage.ts';

type UsersMap = Map<string, string>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE_PATH = path.join(__dirname, 'users.txt');

const USER_RECORD_SEPARATOR = ';';

export class UsersStorage {
  static instance: UsersStorage | undefined;
  static initializationPromise: Promise<UsersStorage> | undefined;

  private usersCache: UsersMap;
  private userAvatarBots: UserAvatarBotsStorage;

  constructor(userAvatarBots: UserAvatarBotsStorage) {
    this.userAvatarBots = userAvatarBots;
    this.usersCache = this.loadUsersMap();
  }

  static async getInstance() {
    if (!UsersStorage.instance) {
      if (!UsersStorage.initializationPromise) {
        UsersStorage.initializationPromise = (async () => {
          const avatars = await UserAvatarBotsStorage.getInstance();
          if (!avatars) {
            throw new Error('UserAvatarBotsStorage not initialized');
          }

          UsersStorage.instance = new UsersStorage(avatars);
          return UsersStorage.instance;
        })();

        UsersStorage.initializationPromise.finally(() => {
          UsersStorage.initializationPromise = undefined;
        });
      }

      await UsersStorage.initializationPromise;
    }

    return UsersStorage.instance!;
  }

  getUserAvatar(userId: number) {
    const userIdAsString = `${userId}`;

    // Если пользователь уже в кэше
    if (this.usersCache.has(userIdAsString)) {
      const botId = this.usersCache.get(userIdAsString)!;
      const bot = this.userAvatarBots.getBot(botId);
      if (bot) {
        return bot;
      }
      this.usersCache.delete(userIdAsString);
    }

    // Назначаем нового бота
    const userAvatarBotId = this.getUserAvatarBotId();
    const bot = this.userAvatarBots.getBot(userAvatarBotId);
    if (!bot) {
      throw new Error(`Bot ${userAvatarBotId} not found`);
    }

    // Сохраняем и возвращаем
    if (this.appendUserRecord(userIdAsString, userAvatarBotId)) {
      this.usersCache.set(userIdAsString, userAvatarBotId);
    }

    return bot;
  }

  resetCache() {
    fs.writeFileSync(USERS_FILE_PATH, '');
    this.usersCache.clear();
  }

  private getUserAvatarBotId() {
    const bots = this.getLeastLoadedBots();
    if (bots.length === 0) {
      throw new Error('No bots available');
    }

    const randomIndex = Math.floor(Math.random() * bots.length);
    return bots[randomIndex]!;
  }

  private getLeastLoadedBots() {
    if (this.usersCache.size === 0) {
      return this.userAvatarBots.getBotIds();
    }

    const loadedBots = new Map<string, number>();
    for (const botId of this.userAvatarBots.getBotIds()) {
      loadedBots.set(botId, 0);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, botId] of this.usersCache.entries()) {
      const totalUsed = loadedBots.get(botId);
      if (totalUsed !== undefined) {
        loadedBots.set(botId, totalUsed + 1);
      }
    }

    let minimum = Number.POSITIVE_INFINITY;
    let botIds: string[] = [];
    for (const [botId, total] of loadedBots.entries()) {
      if (total < minimum) {
        minimum = total;
        botIds = [botId];
      }

      if (total === minimum) {
        botIds.push(botId);
      }
    }

    return botIds;
  }

  private loadUsersMap() {
    try {
      const users: UsersMap = new Map();
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');

      const items = data.split(USER_RECORD_SEPARATOR);
      for (const item of items) {
        const [userId, botId] = parseUserRecord(item);
        if (userId && botId) {
          users.set(userId, botId);
        }
      }

      return users;
    } catch (error) {
      console.error(error);
      return new Map();
    }
  }

  private appendUserRecord(userId: string, botId: string) {
    try {
      const userRecord = formatUserRecord(userId, botId);
      fs.writeFileSync(USERS_FILE_PATH, userRecord, { flag: 'a' });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

function formatUserRecord(key: string, value: string) {
  return `${key}=${value}${USER_RECORD_SEPARATOR}`;
}

function parseUserRecord(item: string) {
  return item.split('=');
}
