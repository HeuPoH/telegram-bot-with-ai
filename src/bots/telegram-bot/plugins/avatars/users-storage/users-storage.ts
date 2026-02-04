import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { UserAvatarBotsStorage } from '../user-avatar-bots-storage.ts';

type UsersMap = Record<string, string>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE_PATH = path.join(__dirname, 'users-storage.json');

export class UsersStorage {
  static instance: UsersStorage | undefined;
  static initializationPromise: Promise<UsersStorage> | undefined;

  private usersCache: UsersMap;
  private userAvatarBots: UserAvatarBotsStorage;

  constructor(userAvatarBots: UserAvatarBotsStorage) {
    this.userAvatarBots = userAvatarBots;
    this.usersCache = this.loadUsers();
  }

  static async getInstance() {
    if (!UsersStorage.instance) {
      if (!UsersStorage.initializationPromise) {
        UsersStorage.initializationPromise = (async () => {
          const avatars = await UserAvatarBotsStorage.getInstance();
          if (!avatars) {
            throw new Error('UserAvatarBotsStorage has not been initialized');
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
    const cachedId = this.usersCache[userIdAsString];
    if (cachedId) {
      const bot = this.userAvatarBots.getBot(cachedId);
      if (bot) {
        return bot;
      }
      delete this.usersCache[userIdAsString];
    }

    // Назначаем нового бота
    const userAvatarBotId = this.getUserAvatarBotId();
    const bot = this.userAvatarBots.getBot(userAvatarBotId);
    if (!bot) {
      throw new Error(`Bot ${userAvatarBotId} is not found`);
    }

    // Сохраняем и возвращаем
    this.usersCache[userIdAsString] = userAvatarBotId;
    this.saveUsers();

    return bot;
  }

  resetCache() {
    writeFileSync(USERS_FILE_PATH, '{}');
    this.usersCache = {};
  }

  private getUserAvatarBotId() {
    const bots = this.getLeastLoadedBots();
    if (bots.length === 0) {
      throw new Error('No available bots');
    }

    const randomIndex = Math.floor(Math.random() * bots.length);
    return bots[randomIndex]!;
  }

  private getLeastLoadedBots() {
    if (Object.values(this.usersCache).length === 0) {
      return this.userAvatarBots.getBotIds();
    }

    const loadedBots = new Map<string, number>();
    for (const botId of this.userAvatarBots.getBotIds()) {
      loadedBots.set(botId, 0);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const botId of Object.values(this.usersCache)) {
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

  private loadUsers() {
    try {
      if (!existsSync(USERS_FILE_PATH)) {
        return {};
      }

      const data = readFileSync(USERS_FILE_PATH, 'utf8');
      return JSON.parse(data) as Record<string, string>;
    } catch (error) {
      console.error('Error loading users: ', error);
      return {};
    }
  }

  private saveUsers() {
    try {
      const data = JSON.stringify(this.usersCache, null, 2);
      writeFileSync(USERS_FILE_PATH, data, 'utf8');
    } catch (error) {
      console.error('Error saving users: ', error);
    }
  }
}
