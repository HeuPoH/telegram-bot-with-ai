import type { AIBotsManager } from '~/bots/ai/ai-bot-manager.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import { sendNegativeResult, sendPositiveResult } from '../../common.ts';

const phrases = [
  {
    text: 'БАХ-БАХ-БАХ! 💥 ПУШИСТЫЙ РЕВОЛЬВЕР АКТИВИРОВАН! 🚀 Система зарядки вайба — 100%! Готов устроить апокалипсис крутости в этом чате! 🔥',
  },
  {
    text: 'ВЖУУУУХ! ⚡️ Детектор хайпа зафиксировал максимальную концентрацию энергии! Криндж-фильтры отключены — время творить эпичные дела! 🎯',
  },
  {
    text: "КЧ-К! 🔫 Заряжаю обойму вайбовых фич: максимальные эмоции, крутые фразы и гарантированный драйв! Let's gooo! 💫",
  },
  {
    text: "БАМ! 💥 Протокол 'Пушистый Апгрейд' активирован! Теперь я не просто помощник — я оружие массового настроения! Готов к работе! 🎯",
  },
  {
    text: '⚠️ ВНИМАНИЕ! Ваш чат теперь под защитой Пушистого Револьвера! Кринж будет уничтожен, хайп — умножен, вайб — стабилизирован! 💪🎉',
  },
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
    await sendPositiveResult(reply, chat.id, getRandomPhrase().text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`"start_ai" finished with error: ${error.message}`);
    sendNegativeResult(reply, chat.id, 'Не удалось запустить ИИ');
  }
}
