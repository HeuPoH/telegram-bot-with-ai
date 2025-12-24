import type { Reply } from '../bot-types/reply.ts';
import type { Update } from '../bot-types/update.ts';
import { GenericObservable } from './generic-observable.ts';

export type CommandData = Update & {
  command_args: string[];
  command_flags: Record<string, string | boolean>;
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
  const { flags, args } = parseCommandLine(
    update.message!.text!.slice(command.length - 1),
  );

  return {
    ...update,
    command_args: args,
    command_flags: flags,
  };
}

function parseCommandLine(input: string) {
  const result = {
    flags: {} as { [key: string]: string | boolean },
    args: [] as string[],
  };

  // Шаг 1: Извлекаем все строки в кавычках (аргументы) сначала
  const stringRegex = /"([^"\\]|\\.)*"/g;
  const strings: { value: string; start: number; end: number }[] = [];

  let match;
  while ((match = stringRegex.exec(input)) !== null) {
    const fullMatch = match[0];
    const value = fullMatch
      .slice(1, -1) // Убираем внешние кавычки
      .replaceAll(/\\(.)/g, '$1'); // Убираем экранирование

    strings.push({
      value,
      start: match.index,
      end: match.index + fullMatch.length,
    });
  }

  // Шаг 2: Помечаем позиции строк, чтобы не парсить их как часть флагов
  const isInString = (index: number) => {
    return strings.some(str => index >= str.start && index < str.end);
  };

  // Шаг 3: Ищем флаги (не находящиеся внутри строк)
  const flagRegex = /-(\w+)(=("[^"\\]*(?:\\.[^"\\]*)*"|[^\s"]+))?/g;

  while ((match = flagRegex.exec(input)) !== null) {
    // Пропускаем, если флаг находится внутри строки
    if (isInString(match.index)) {
      continue;
    }

    const flagName = match[1]!;
    let flagValue: string | boolean = true;

    // Если есть значение (через =)
    if (match[2]) {
      const valuePart = match[3];

      // Если значение в кавычках
      if (valuePart?.startsWith('"')) {
        flagValue = valuePart
          .slice(1, -1) // Убираем кавычки
          .replaceAll(/\\(.)/g, '$1'); // Убираем экранирование
      } else if (valuePart) {
        // Если значение без кавычек
        flagValue = valuePart;
      }
    }

    result.flags[flagName] = flagValue;
  }

  // Шаг 4: Все строки, которые не являются значениями флагов через =, добавляем в args
  for (const str of strings) {
    // Проверяем, не является ли эта строкой значением флага через =
    const isFlagValue = [
      ...input.slice(0, str.start).matchAll(/-(\w+)=/g),
    ].some(flagMatch => {
      const flagEnd = flagMatch.index! + flagMatch[0].length;
      return flagEnd === str.start;
    });

    if (!isFlagValue) {
      result.args.push(str.value);
    }
  }

  return result;
}
