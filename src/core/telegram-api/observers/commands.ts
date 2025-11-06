import type { Reply } from '../bot-types/reply.ts';
import type { Update } from '../bot-types/update.ts';
import { GenericObservable } from './generic-observable.ts';

export type CommandData = Update & {
  command_args: string[];
};

export class Commands extends GenericObservable<CommandData> {
  notify(update: Update, reply: Reply) {
    if (!update.message?.text) {
      return;
    }

    const command = update.message.text.match('/[a-zA-Z0-9_]*')?.[0] ?? '';
    const data = getCommandData(update, command);
    this.notifyImpl(command, data, reply);
  }
}

function getCommandData(update: Update, command: string): CommandData {
  return {
    ...update,
    command_args: parseCommandRegex(
      update.message!.text!.slice(command.length - 1),
    ),
  };
}

function parseCommandRegex(input: string) {
  // Регулярное выражение для поиска строк в кавычках
  const regex = /"([^"\\]|\\.)*"/g;
  const options = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    // Убираем экранирование и добавляем опцию
    const option = match[0]
      .slice(1, -1) // Убираем внешние кавычки
      .replaceAll(/\\(.)/g, '$1'); // Убираем экранирование
    options.push(option);
  }

  return options;
}
