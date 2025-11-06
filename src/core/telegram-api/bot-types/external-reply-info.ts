import type { Animation } from './animation.ts';
import type { Audio } from './audio.ts';
import type { Chat } from './chat.ts';
import type { Checklist } from './check-list.ts';
import type { Contact } from './contact.ts';
import type { Dice } from './dice.ts';
import type { Document } from './document.ts';
import type { Giveaway } from './give-away.ts';
import type { GiveawayWinners } from './give-away-winners.ts';
import type { Invoice } from './invoice.ts';
import type { LinkPreviewOptions } from './link-preview-options.ts';
import type { Location } from './location.ts';
import type { MessageOrigin } from './message-origin.ts';
import type { PhotoSize } from './photo-size.ts';
import type { Poll } from './poll.ts';
import type { Sticker } from './sticker.ts';
import type { Story } from './story.ts';
import type { Venue } from './venue.ts';
import type { Video } from './video.ts';
import type { VideoNote } from './video-note.ts';
import type { Voice } from './voice.ts';

/**
 * @see https://core.telegram.org/bots/api#externalreplyinfo
 */
export type ExternalReplyInfo = {
  /**
   * Origin of the message replied to by the given message
   */
  origin: MessageOrigin;

  /**
   * Optional. Chat the original message belongs to. Available only if the chat is a supergroup or a channel.
   */
  chat?: Chat;

  /**
   * Optional. Unique message identifier inside the original chat. Available only if the original chat is a supergroup
   * or a channel.
   */
  message_id?: number;

  /**
   * Optional. Options used for link preview generation for the original message, if it is a text message
   */
  link_preview_options?: LinkPreviewOptions;

  /**
   * Optional. Message is an animation, information about the animation
   */
  animation?: Animation;

  /**
   * Optional. Message is an audio file, information about the file
   */
  audio?: Audio;

  /**
   * Optional. Message is a general file, information about the file
   */
  document?: Document;

  /**
   * Optional. Message is a photo, available sizes of the photo
   */
  photo?: PhotoSize[];

  /**
   * Optional. Message is a sticker, information about the sticker
   */
  sticker?: Sticker;

  /**
   * Optional. Message is a forwarded story
   */
  story?: Story;

  /**
   * Optional. Message is a video, information about the video
   */
  video?: Video;

  /**
   * Optional. Message is a video note, information about the video message
   */
  video_note?: VideoNote;

  /**
   * Optional. Message is a voice message, information about the file
   */
  voice?: Voice;

  /**
   * Optional. True, if the message media is covered by a spoiler animation
   */
  has_media_spoiler?: boolean;

  /**
   * Optional. Message is a checklist
   */
  checklist?: Checklist;

  /**
   * Optional. Message is a shared contact, information about the contact
   */
  contact?: Contact;

  /**
   * Optional. Message is a dice with random value
   */
  dice?: Dice;

  /**
   * Optional. Message is a scheduled giveaway, information about the giveaway
   */
  giveaway?: Giveaway;

  /**
   * Optional. A giveaway with public winners was completed
   */
  giveaway_winners?: GiveawayWinners;

  /**
   * Optional. Message is an invoice for a payment, information about the invoice. [More about payments](https://core.telegram.org/bots/api#payments)
   */
  invoice?: Invoice;

  /**
   * Optional. Message is a shared location, information about the location
   */
  location?: Location;

  /**
   * Optional. Message is a native poll, information about the poll
   */
  poll?: Poll;

  /**
   * Optional. Message is a venue, information about the venue
   */
  venue?: Venue;
};
