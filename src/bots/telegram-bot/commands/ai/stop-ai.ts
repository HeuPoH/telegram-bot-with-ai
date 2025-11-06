import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

const phrases = [
  'БАХ-БАХ! 💥 Пушистый Револьвер уходит в спячку! Но не грустите — скоро вернусь с новыми вайбовыми опросами! 💤🎯',
  'КЧ-К! 🔫 Пушистый Револьвер временно складывает стволы! Отдыхаю, чтобы вернуться с тройной дозой хайпа! 💫',
  'ВЖУХ! 🚀 Ваш любимый пушистик уходит на перезарядку! Скоро вернусь с опросами круче прежних! ⚡️',
  'КРИНЖ! 🚨 Но факт: Пушистый Револьвер временно припаркован в гараже! Скоро снова буду стрелять опросами! 🔧💥',
  'Пушистый Револьвер переходит в режим энергосбережения! Не забывайте — даже супер-герою нужен перерыв! 😴⚡️',
];

function getRandomPhrase() {
  const idx = Math.round(Math.random() * (phrases.length - 1));
  return phrases[idx]!;
}

export async function stopAI(
  data: CommandData,
  reply: Reply,
  aiBotsManager: AIBotsManager,
) {
  const { chat, from } = data.message ?? {};
  if (!from || !chat) {
    return;
  }

  try {
    aiBotsManager.stopBot(`${chat.id}`);
    await reply.sendMessage({
      chat_id: chat.id,
      text: getRandomPhrase(),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to stop AI');
    reply.sendMessage({
      chat_id: chat.id,
      text: error.message,
    });
  }
}
