import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult, sendPositiveResult } from '../../common.ts';
import type { CommandsFactoryItem } from '../../commands/factory/types.ts';

export const StartAI: (botsManager: AIBotsManager) => CommandsFactoryItem = (botsManager: AIBotsManager) => {
  return {
    label: 'Запустить AI бота',
    type: '/start_ai',
    handle: (data, reply) => startAI(data, reply, botsManager),
    description: () => ({
      format: '/start_ai',
    }),
  }
};

async function startAI(
  data: CommandData,
  reply: Reply,
  aiBotsManager: AIBotsManager,
) {
  const chat = data.message?.chat;
  if (!chat) {
    return;
  }

  try {
    aiBotsManager.startBot(`${chat.id}`, {
      apiKey: process.env.MISTRAL_API_KEY!,
      model: 'magistral-small-2509',
      botType: 'fuzzy-gunner',
    });
    await sendPositiveResult(reply, chat.id, 'ИИ запущен');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`"start_ai" finished with error: ${error.message}`);
    sendNegativeResult(reply, chat.id, 'Не удалось запустить ИИ');
  }
}
