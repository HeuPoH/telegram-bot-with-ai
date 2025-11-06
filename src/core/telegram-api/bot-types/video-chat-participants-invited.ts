import type { User } from './user.ts';

/**
 * @see https://core.telegram.org/bots/api#videochatparticipantsinvited
 */
export type VideoChatParticipantsInvited = {
  /**
   * New members that were invited to the video chat
   */
  users: User[];
};
