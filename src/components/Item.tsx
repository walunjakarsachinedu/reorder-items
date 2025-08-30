import { isDraggableWithGetter, type DraggableWithGetter, type DropEventDetail } from "drag-and-drop-plugin";
import { useEffect, useRef } from "react";
import type { ReorderHandler } from "../types";
import "./Item.css";


type ItemProps = {
  id: number;
  onItemInsert?: ReorderHandler; 
}

function Item({ id, onItemInsert }: ItemProps) {
  const ref = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const el = (ref.current as unknown) as DraggableWithGetter<number>;
    el.getDragData = () => id;

    const swdDropHandler = (ev: CustomEvent<DropEventDetail>) => {
      const { target, dropPos, dragCopy } = ev.detail;
      if(isDraggableWithGetter(target)) {
        const data = target.getDragData();
        if(typeof data != "number") return;
        onItemInsert?.({dropItemId: id, dragItemId: data, pos: dropPos, draggedElement: target, dragCopy});
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
      className="item"
      data-flip-id={`item-${id}`}
      data-swd-targets="item" 
      data-swd-zones="item" 
    >
      Item {id}
    </div>
  );
}

export { Item };