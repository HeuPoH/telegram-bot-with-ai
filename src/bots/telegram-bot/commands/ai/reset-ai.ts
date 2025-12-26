import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult, sendPositiveResult } from '../../common.ts';

export async function resetAIs(
  data: CommandData,
  reply: Reply,
  aiBotsManager: AIBotsManager,
) {
  const chat = data.message?.chat;
  if (!chat) {
    return;
  }

  try {
    aiBotsManager.resetBots();
    await sendPositiveResult(reply, chat.id, 'ПУШИСТЫЙ РЕБУТ АКТИВИРОВАН! 🚀');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`"reset_ai" finished with error: ${error.message}`);
    sendNegativeResult(reply, chat.id, 'Не удалось сбросить API токены у ИИ');
  }
}
