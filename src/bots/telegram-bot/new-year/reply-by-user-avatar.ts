import type { Message } from '~/core/telegram-api/bot-types/message.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { SendAnimation } from '~/core/telegram-api/bot-types/send-animation.ts';
import type { SendMessage } from '~/core/telegram-api/bot-types/send-message.ts';
import type { SendPhoto } from '~/core/telegram-api/bot-types/send-photo.ts';
import type { SendSticker } from '~/core/telegram-api/bot-types/send-sticker.ts';
import type { User } from '~/core/telegram-api/bot-types/user.ts';

export function getStrategyReply(message: Message) {
  if (message.sticker) {
    return sendSticker;
  }

  if (message.animation) {
    return sendAnimation;
  }

  if (message.text) {
    return sendMessage;
  }

  if (message.photo) {
    return sendPhoto;
  }

  if (message.poll) {
    return sendPoll;
  }
}

function sendMessage(message: Message, reply: Reply) {
  if (!message.text) {
    return;
  }

  const data: SendMessage = {
    chat_id: message.chat.id,
    text: message.text,
  };

  if (message.reply_to_message) {
    applyReplyMessageIfNeed(message.reply_to_message, data);
  }

  return reply.sendMessage(data);
}

function applyReplyMessageIfNeed(replyMessage: Message, data: SendMessage) {
  const originalMsg = replyMessage;
  const originalFrom = originalMsg.from;

  data.parse_mode = 'HTML';
  data.link_preview_options = { is_disabled: true };

  const messageLink = makeMessageLink(originalMsg);
  const authorName = makeAuthorName(originalFrom);

  let quoteText = '';
  if (originalMsg.text) {
    quoteText = makeMessageShorter(extractOriginalTextRegex(originalMsg.text));
  } else if (originalMsg.sticker) {
    quoteText = originalMsg.sticker.emoji
      ? `Стикер ${originalMsg.sticker.emoji}`
      : 'Стикер';
  } else if (originalMsg.photo) {
    quoteText = 'Фотография';
    if (originalMsg.caption) {
      quoteText += `: ${originalMsg.caption.slice(0, 50)}...`;
    }
  } else if (originalMsg.animation) {
    quoteText = 'GIF-анимация';
  } else {
    quoteText = 'Сообщение';
  }

  data.text = `👇 <b>Ответ на сообщение</b>\n├ <b>От:</b> <a href="${messageLink}">${authorName}</a>\n├ <b>Текст:</b> <i>${quoteText}</i>\n└\n${data.text}`;
}

function extractOriginalTextRegex(formattedText: string): string {
  const match = formattedText.match(/└\n([\S\s]*)/);
  return match ? match[1] || formattedText : formattedText;
}

function makeMessageLink(message: Message) {
  // Преобразуем chat_id для публичной ссылки (убираем "-100")
  const sourceChatIdForLink = String(message.chat.id).replace('-100', '');
  return `https://t.me/c/${sourceChatIdForLink}/${message.message_id}`;
}

function makeAuthorName(from?: User) {
  return from?.first_name ?? 'Неизвестный';
}

function makeMessageShorter(text: string) {
  return text.length > 30 ? text.slice(0, 30) + '...' : text;
}

function sendAnimation(message: Message, reply: Reply) {
  const animation = message.animation;
  if (!animation) {
    return;
  }

  const data: SendAnimation = {
    chat_id: message.chat.id,
    animation: animation.file_id,
    width: animation.width,
    height: animation.height,
    duration: animation.duration,
  };

  return reply.sendAnimation(data);
}

function sendSticker(message: Message, reply: Reply) {
  const sticker = message.sticker;
  if (!sticker) {
    return;
  }

  const data: SendSticker = {
    chat_id: message.chat.id,
    sticker: sticker.file_id,
    emoji: sticker.emoji,
  };

  return reply.sendSticker(data);
}

function sendPhoto(message: Message, reply: Reply) {
  const photo = message.photo?.[0];
  if (!photo) {
    return;
  }

  const data: SendPhoto = {
    chat_id: message.chat.id,
    photo: photo.file_id,
    caption: message.caption,
  };

  return reply.sendPhoto(data);
}

function sendPoll(message: Message, reply: Reply) {
  const poll = message.poll;
  if (!poll) {
    return;
  }

  return reply.sendPoll({
    chat_id: message.chat.id,
    question: poll.question,
    options: poll.options,
    is_anonymous: poll.is_anonymous,
    allows_multiple_answers: poll.allows_multiple_answers,
    type: poll.type,
  });
}
