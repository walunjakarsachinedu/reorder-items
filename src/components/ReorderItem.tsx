import { isDraggableWithGetter, type DraggableWithGetter, type DropEventDetail } from "drag-and-drop-plugin";
import { useEffect, useLayoutEffect, type ReactNode, type RefObject } from "react";
import type { ReorderHandler } from "../types";


type Props = {
  id: string;
  onItemInsert?: ReorderHandler;
  children: ReactNode;
  itemRefs: RefObject<{ [id in string]: HTMLElement | null }>,
}

function ReorderItem({ id, onItemInsert, children, itemRefs }: Props) {

  useLayoutEffect(() => {
    const elRef = itemRefs.current[id];
    if (!elRef) return;

    elRef.dataset.swdFlipId = `item-${id}`;
    elRef.dataset.swdTargets = `item`;
    elRef.dataset.swdZones = `item`;
  }, [id, itemRefs]);

  useEffect(() => {
    const elRef = itemRefs.current[id];
    if (!elRef) return;

    const el = (elRef as unknown) as DraggableWithGetter<string>;
    el.getDragData = () => id;

    const swdDropHandler = (ev: CustomEvent<DropEventDetail>) => {
      const { target, dropPos, dragCopy } = ev.detail;
      if (isDraggableWithGetter(target)) {
        const data = target.getDragData();
        if (typeof data != "string") return;
        onItemInsert?.({ dropItemId: id, dragItemId: data, pos: dropPos, draggedElement: target, dragCopy });
      }
    };
    el?.addEventListener("swd-drop", swdDropHandler);
    return () => {
      el?.removeEventListener("swd-drop", swdDropHandler);
    }
  }, [id, onItemInsert, itemRefs]);

  return <>{children}</>;
}

export { ReorderItem };
