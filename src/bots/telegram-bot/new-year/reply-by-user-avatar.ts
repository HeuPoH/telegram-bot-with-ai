import type { Message } from '~/core/telegram-api/bot-types/message.ts';
import type { Reply } from '~/core/telegram-api/bot-types/reply.ts';
import type { SendAnimation } from '~/core/telegram-api/bot-types/send-animation.ts';
import type { SendMessage } from '~/core/telegram-api/bot-types/send-message.ts';
import type { SendPhoto } from '~/core/telegram-api/bot-types/send-photo.ts';
import type { SendSticker } from '~/core/telegram-api/bot-types/send-sticker.ts';

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

  putReplyParamsIfNeed(message, data);
  return reply.sendMessage(data);
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

  putReplyParamsIfNeed(message, data);
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

  putReplyParamsIfNeed(message, data);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function putReplyParamsIfNeed(message: Message, data: any) {
  if (message.reply_to_message) {
    data.reply_parameters = { message_id: message.reply_to_message.message_id };
  }
}
