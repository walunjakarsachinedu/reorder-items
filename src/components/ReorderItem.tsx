import { isDraggableWithGetter, type DraggableWithGetter, type DropEventDetail } from "drag-and-drop-plugin";
import { useEffect, useRef, type ReactNode } from "react";
import type { ReorderHandler } from "../types";


type Props = {
  id: string;
  onItemInsert?: ReorderHandler;
  children: ReactNode;
  className?: string;
}

function ReorderItem({ id, onItemInsert, children, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = (ref.current as unknown) as DraggableWithGetter<string>;
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
  }, [id, onItemInsert]);

  return (
    <div
      ref={ref}
      key={id}
      className={`item ${className}`}
      data-flip-id={`item-${id}`}
      data-swd-targets="item"
      data-swd-zones="item"
    >
      {children}
    </div>
  );
}

export { ReorderItem };