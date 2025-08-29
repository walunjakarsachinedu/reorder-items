import type { Area } from "drag-and-drop-plugin";

export type ReorderHandler = (itemId: number, dropItemId: number, pos: Area) => void;