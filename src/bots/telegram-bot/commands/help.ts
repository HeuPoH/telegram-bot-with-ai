import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { CommandData } from '~/core/telegram-api/observers/commands.ts';

import type { ICommandsFactory } from './factory/types.ts';

export function help(
  data: CommandData,
  reply: Reply,
  factory: ICommandsFactory,
) {
  if (!data.message) {
    console.error('Failed to show help');
    return;
  }

  const text = makeHelp(factory);
  const chat_id = data.message.chat.id;
  reply.sendMessage({
    chat_id,
    text,
    parse_mode: 'HTML',
  });
}

function makeHelp(factory: ICommandsFactory) {
  const lines: string[] = [];
  const commands = factory.getAllRegistered();
  for (const command of commands) {
    const { description } = command;
    if (!description) {
      continue;
    }

    const { format, examples, more } = description();
    const html: string[] = [
      `<b>Команда</b>: <code>${command.type}</code> - ${command.label}`,
      `<b>Формат</b>: <code>${format}</code>`,
    ];

    if (examples) {
      html.push(`<b>Примеры:</b>\n<code>${examples}</code>`);
    }

    if (more) {
      html.push(more);
    }

    lines.push(...html, '\n');
  }

  return lines.join('\n');
}
