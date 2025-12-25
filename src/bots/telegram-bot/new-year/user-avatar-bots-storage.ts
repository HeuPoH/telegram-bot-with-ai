import { TelegramBot } from '~/core/telegram-api/telegram-bot.ts';

export class UserAvatarBotsStorage {
  static instance: UserAvatarBotsStorage | undefined;
  static initializationPromise: Promise<UserAvatarBotsStorage> | undefined;

  private bots = new Map<string, TelegramBot>();

  private constructor() {}

  static async getInstance() {
    try {
      if (!UserAvatarBotsStorage.instance) {
        if (!UserAvatarBotsStorage.initializationPromise) {
          UserAvatarBotsStorage.initializationPromise = (async () => {
            const inst = new UserAvatarBotsStorage();
            await inst.loadBots();
            UserAvatarBotsStorage.instance = inst;
            return inst;
          })();

          UserAvatarBotsStorage.initializationPromise.finally(() => {
            UserAvatarBotsStorage.initializationPromise = undefined;
          });
        }
        await UserAvatarBotsStorage.initializationPromise;
      }
      return UserAvatarBotsStorage.instance;
    } catch (error) {
      console.log(error);
    }
  }

  getBot(id: string) {
    return this.bots.get(id);
  }

  getBotIds() {
    return [...this.bots.keys()];
  }

  loadBots() {
    const promises: Promise<void>[] = [];
    const tokens = (process.env.TELEGRAM_BOT_TOKENS ?? '')
      .split(';')
      .map(t => t.trim());

    if (tokens.length === 0) {
      console.warn('No Telegram bot tokens provided in TELEGRAM_BOT_TOKENS');
      return;
    }

    for (const token of tokens) {
      const promise = TelegramBot.create(token, [
        'message',
        'inline_query',
      ]).then(instance => {
        this.bots.set(`${instance.getBotInfo().id}`, instance);
      });
      promises.push(promise);
    }

    return Promise.allSettled(promises);
  }
}
