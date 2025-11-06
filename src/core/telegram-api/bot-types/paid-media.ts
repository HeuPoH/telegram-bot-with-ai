import type { PaidMediaVideo } from './padi-media-video.ts';
import type { PaidMediaPhoto } from './paid-media-photo.ts';
import type { PaidMediaPreview } from './paid-media-preview.ts';

/**
 * @see https://core.telegram.org/bots/api#paidmedia
 */
export type PaidMedia = PaidMediaPreview | PaidMediaPhoto | PaidMediaVideo;
