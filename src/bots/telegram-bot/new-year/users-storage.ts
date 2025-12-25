import fs from 'node:fs';

import { getFilePath } from './helpers.ts';
import { UserAvatarBotsStorage } from './user-avatar-bots-storage.ts';

type UsersMap = Map<string, string>;

const USERS_FILE_PATH = getFilePath('users.txt');

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

    return UsersStorage.instance;
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

  private getUserAvatarBotId() {
    const bots = this.userAvatarBots.getBotIds();
    if (bots.length === 0) {
      throw new Error('No bots available');
    }

    const randomIndex = Math.floor(Math.random() * bots.length);
    return bots[randomIndex]!;
  }

  private loadUsersMap() {
    try {
      const users: UsersMap = new Map();
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');

      const items = data.split(USER_RECORD_SEPARATOR);
      for (const item of items) {
        const [key, value] = parseUserRecord(item);
        if (key && value) {
          users.set(key, value);
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
