import { useRef, useState } from "react";
import { ReorderList } from "./ReorderItem/ReorderList";

type Item = { id: string; name: string };

export default function PersonTxs() {
  const itemRefs = useRef<{ [key in string]: HTMLElement | null }>({});

  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
    { id: "4", name: "Item 4" },
    { id: "5", name: "Item 5" },
    { id: "6", name: "Item 6" },
    { id: "7", name: "Item 7" },
    { id: "8", name: "Item 8" },
    { id: "9", name: "Item 9" },
    { id: "10", name: "Item 10" },
  ]);

  return (
    <ReorderList
      onReorder={setItems}
      className="d-flex flex-wrap center-h"
      items={items}
      itemRefs={itemRefs}
      renderItem={(item) => (
        <div
          ref={(el) => { itemRefs.current[item.id] = el; }}
          data-swd-offset={"left:6,right:4"}
          data-swd-target-drag-point="handle"
          style={{
            padding: "10px",
            margin: "5px",
            border: "1px solid #505050ff",
            borderRadius: "4px",
          }}
        >
          <div>{item.name}</div>
          <small data-swd-drag-point="handle" style={{ backgroundColor: "green" }}>handle</small>
        </div>
      )}
    />
  );
}
