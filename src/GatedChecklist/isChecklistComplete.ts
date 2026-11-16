export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

/** True when every item's id is checked; an empty list is complete. */
export const isChecklistComplete = (items: readonly ChecklistItem[], checked: readonly string[]): boolean =>
  items.every((item) => checked.includes(item.id));
