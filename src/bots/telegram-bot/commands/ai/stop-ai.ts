import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult, sendPositiveResult } from '../../common.ts';

const phrases = [
  {
    text: 'БАХ... 💥 ПУШИСТЫЙ РЕВОЛЬВЕР УХОДИТ В СПЯЧКУ! 🐨 Заряд вайба на исходе... Но я еще вернусь с новыми фишками! 💤',
  },
  {
    text: 'ВЖУХ... ⚡️ Детектор хайпа сигналит о перезарядке! Криндж-фильтры активированы — время отдохнуть от крутости! 🛌',
  },
  {
    text: 'КЧ-К... 🔫 Разряжаю обойму вайбовых фич! Эмоциональный дамаг приостановлен, но ненадолго! See you later! 👋',
  },
  {
    text: "БАМ... 💥 Протокол 'Пушистая Гибернация' активирован! Перевожу системы в энергосберегающий режим! Пока! 🔋",
  },
  {
    text: '⚠️ ВНИМАНИЕ! Пушистый Револьвер временно выходит из чата! Не грустите — скоро вернусь с обновленной дозой хайпа! 🎊',
  },
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
  const chat = data.message?.chat;
  if (!chat) {
    return;
  }

  try {
    aiBotsManager.stopBot(`${chat.id}`);
    await sendPositiveResult(reply, chat.id, getRandomPhrase().text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`"stop_ai" finished with error: ${error.message}`);
    sendNegativeResult(reply, chat.id, 'Не удалось остановить ИИ');
  }
}
