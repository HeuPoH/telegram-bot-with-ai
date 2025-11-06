import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

export async function resetAIs(
  data: CommandData,
  reply: Reply,
  aiBotsManager: AIBotsManager,
) {
  const { chat, from } = data.message ?? {};
  if (!from || !chat) {
    return;
  }

  try {
    aiBotsManager.resetBots();
    await reply.sendMessage({
      chat_id: chat.id,
      text: 'Все боты сброшены',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to reset AI');
    reply.sendMessage({
      chat_id: chat.id,
      text: error.message,
    });
  }
}
