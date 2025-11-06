import type { ChecklistTask } from './check-list-task.ts';
import type { Message } from './message.ts';

/**
 * @see https://core.telegram.org/bots/api#checklisttasksadded
 */
export type ChecklistTasksAdded = {
  /**
   * Optional. Message containing the checklist to which the tasks were added. Note that the Message object in this
   * field will not contain the reply_to_message field even if it itself is a reply.
   */
  checklist_message?: Message;

  /**
   * List of tasks added to the checklist
   */
  tasks: ChecklistTask[];
};
