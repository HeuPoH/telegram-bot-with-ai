/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';
import { sendNegativeResult, sendPositiveResult } from '../../common.ts';
import { storeSettings } from './settings/settings.ts';
import { UsersStorage } from './users-storage/users-storage.ts';
import type { CommandsFactoryItem } from '../../commands/factory/types.ts';

export const AvatarsItem: CommandsFactoryItem = {
  label: 'Аватары',
  type: '/avatars',
  handle: avatars,
  description: () => {
    return {
      format: '/avatars -m="on"|"off"',
      examples: [
        '/avatars -m="on"',
        '/avatars -m="off"'
      ],
      flags: [
        [
          '-m',
          'Включить/Отключить режим'
        ]
      ]
    };
  }
};

async function avatars(data: CommandData, reply: Reply) {
  const message = data.message;
  if (!message) {
    return;
  }

  const chatId = message.chat.id;
  try {
    const flags = data.command_flags;
    if (!flags?.m) {
      return sendNegativeResult(
        reply,
        chatId,
        `ℹ️ Использование:
          /avatars -m=[on|off]
        • -m="on" - активирует режим для этого чата
        • -m="off" - деактивирует режим`
      );
    }

    if (flags.m !== 'on' && flags.m !== 'off') {
      return sendNegativeResult(
        reply,
        chatId,
        `❌ Недопустимое значение флага -m.
        Используйте "on" или "off"`
      );
    }

    const currentChatId = `${chatId}`;
    if (flags.m === 'on') {
      const isAlreadyActive = storeSettings.getTargetChatId() === currentChatId;
      if (isAlreadyActive) {
        return sendNegativeResult(reply, chatId, '❌ Режим уже запущен в этом чате');
      }

      storeSettings.setTargetChatId(currentChatId);
      const usersStorage = await UsersStorage.getInstance();
      usersStorage?.resetCache();
      return sendPositiveResult(reply, chatId, '🎄🎄🎄 Режим активирован 🎄🎄🎄');
    } else {
      const targetChatId = storeSettings.getTargetChatId();
      if (currentChatId === targetChatId) {
        storeSettings.setTargetChatId('-1');
        return sendPositiveResult(reply, chatId, '🎄🎄🎄 Режим остановлен🎄🎄🎄');
      } else {
        return sendNegativeResult(reply, chatId, '❌ Режим еще не был запущен в этом чате');
      }
    }
  } catch (error: any) {
    console.error(`"avatars" finished with error: ${error.message}`);
    sendNegativeResult(reply, chatId, 'Произошла ошибка при запуске режима avatars');
  }
}
