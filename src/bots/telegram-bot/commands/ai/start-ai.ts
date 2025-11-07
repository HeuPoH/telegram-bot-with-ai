import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

const phrases = [
  'БАХ! 💥 Пушистый Револьвер снова в игре! Заряжен вайбом и готов к новым опросам! 🚀',
  'ВЖУХ! ⚡️ Пушистый Револьвер перезагружен и снова стреляет опросами! 💫',
  'Кто меня звал? О, я уже здесь! Пушистый Револьвер активирован! 🔥',
  'Сон окончен! Пушистый Револьвер снова на хайпе! Готов заспамнить вас крутыми опросами! 🎯',
  'Перезарядка завершена! Пушистый Револьвер снова в чате! Пристегнитесь, будет жарко! 💥',
];

function getRandomPhrase() {
  const idx = Math.round(Math.random() * (phrases.length - 1));
  return phrases[idx]!;
}

export async function startAI(
  data: CommandData,
  reply: Reply,
  aiBotsManager: AIBotsManager,
) {
  const { chat, from } = data.message ?? {};
  if (!from || !chat) {
    return;
  }

  try {
    aiBotsManager.startBot(`${chat.id}`, {
      apiKey: process.env.MISTRAL_API_KEY!,
      model: 'magistral-small-2509',
      botType: 'fuzzy-gunner',
    });
    await reply.sendMessage({
      chat_id: chat.id,
      text: getRandomPhrase(),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to start AI');
    reply.sendMessage({
      chat_id: chat.id,
      text: error.message,
    });
  }
}
