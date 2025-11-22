/* eslint-disable @typescript-eslint/no-explicit-any */
import { appStore } from '~/core/app-store.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

const kitty_say_hi =
  'CgACAgQAAyEFAASmv4DZAAIKt2kha4U9TtKUDJxdmMkGajiBJVdyAAI1BAACa1S9UxdCkiqjAUsKNgQ';
const kitty_say_bye =
  'CgACAgQAAyEFAASmv4DZAAIKtmkhawIepM9LGC5GQIK3b3ayFveMAAKZAwACxkfcU0yUrdJwQDduNgQ';

export async function helloKitty(data: CommandData, reply: Reply) {
  const store = appStore;
  if (store.getAppStatus() === 'massive_ban') {
    return;
  }

  const message = data.message;
  if (!message) {
    return;
  }

  try {
    const chatId = message.chat.id;
    await reply.sendAnimation({
      chat_id: chatId,
      animation: kitty_say_hi,
    });

    appStore.setAppStatus('massive_ban');

    setTimeout(() => {
      reply
        .sendAnimation({
          chat_id: chatId,
          animation: kitty_say_bye,
        })
        .catch((error: any) => console.log(error))
        .finally(() => appStore.setAppStatus('default'));
    }, 30_000);
  } catch (error: any) {
    console.error(error.message);
  }
}
