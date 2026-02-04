import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import type { CommandsFactoryItem } from '../../commands/factory/types.ts';
import { sendNegativeResult, sendPositiveResult } from '../../common.ts';

export const StopAI: (botsManager: AIBotsManager) => CommandsFactoryItem = (botsManager: AIBotsManager) => {
  return {
    label: 'Остановить бота',
    type: '/stop_ai',
    handle: (data, reply) => stopAI(data, reply, botsManager),
    description: () => ({
      format: '/stop_ai',
    })
  }
};

async function stopAI(
  data: CommandData,
  reply: Reply,
  aiBotsManager: AIBotsManager,
) {
  const chat = data.message?.chat;
  if (!chat) {
    return;
  }

  try {
    aiBotsManager.stopBot(`${chat.id}`);
    await sendPositiveResult(reply, chat.id, 'ИИ остановлен');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`"stop_ai" finished with error: ${error.message}`);
    sendNegativeResult(reply, chat.id, 'Не удалось остановить ИИ');
  }
}
