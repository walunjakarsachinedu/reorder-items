import type { Area } from "drag-and-drop-plugin";

export type ReorderHandler = (event: {
  /** element on which we are dropping. */
  dropItemId: number, 
  /** element which we are dropping. */
  dragItemId: number, 
  pos: Area, 
  draggedElement: HTMLElement|null, 
  dragCopy: HTMLElement|null
}) => void;