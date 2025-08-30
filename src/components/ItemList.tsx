import { useRef, useState } from "react";
import "./ItemList.css";
import { ReorderList, type ReorderListRef } from "./ReorderList";


function ItemList() {
  const ref = useRef<ReorderListRef | null>(null);

  const [items, setItems] = useState<{ id: string, key: number }[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({ id: id.toString(), key: id })));
  const [layout, setLayout] = useState<"flex-row-wrap" | "flex-column-wrap">("flex-row-wrap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("asc");


  const toggleLayout = () => {
    setLayout(layout == "flex-row-wrap" ? "flex-column-wrap" : "flex-row-wrap");
    ref.current?.recordItemState();
  }

  const sortLayout = () => {
    const order = !sortOrder ? "asc" : sortOrder == "asc" ? "desc" : "asc";
    setItems(items.sort((a, b) => order == "asc" ? a.key - b.key : b.key - a.key));
    setSortOrder(order);
    ref.current?.recordItemState();
  }

  return (
    <div className="center">
      <div className="item-list">
        <button className="btn" onClick={sortLayout}>
          sort items <b>{sortOrder && (sortOrder == "asc" ? "↑" : "↓")}</b>
        </button>
        <button className="btn" onClick={toggleLayout}>toggle layout</button>
      </div>
      <ReorderList
        ref={ref}
        items={items}
        className={layout}
        onReorder={items => setItems(items)}
        renderItem={item => <div>Item {item.id}</div>}
      ></ReorderList>
    </div>
  );
}

export { ItemList };
