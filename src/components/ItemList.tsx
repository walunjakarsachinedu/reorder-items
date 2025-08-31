import gsap from "gsap";
import { useRef, useState } from "react";
import "./ItemList.css";
import { flipBatchName, ReorderList, type ReorderListRef } from "./ReorderList";
import { Flip } from "gsap/all";


function ItemList() {
  const ref = useRef<ReorderListRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const q = gsap.utils.selector(containerRef);
  const batch = Flip.batch(flipBatchName);

  const [items, setItems] = useState<{ id: string, key: number }[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({ id: id.toString(), key: id })));
  const [layout, setLayout] = useState<"flex-row-wrap" | "flex-column-wrap">("flex-row-wrap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("asc");

  const toggleLayout = () => {
    setLayout(layout == "flex-row-wrap" ? "flex-column-wrap" : "flex-row-wrap");
    ref.current?.scheduleAnimationForSelector(() => q(".item-list > .btn"));
    ref.current?.scheduleListAnimation();
    batch.getState();
  }

  const sortLayout = () => {
    const order = !sortOrder ? "asc" : sortOrder == "asc" ? "desc" : "asc";
    setItems(items.sort((a, b) => order == "asc" ? a.key - b.key : b.key - a.key));
    setSortOrder(order);
    ref.current?.scheduleListAnimation();
    batch.getState();
  }

  return (
    <div ref={containerRef} className="center">
      <div className="item-list">
        <button className="btn" onClick={sortLayout}>
          sort items <b>{sortOrder && (sortOrder == "asc" ? "↑" : "↓")}</b>
        </button>
        <button className="btn" onClick={toggleLayout}>toggle layout</button>
        <ReorderList
          ref={ref}
          items={items}
          className={layout}
          onReorder={items => setItems(items)}
          renderItem={item => <div>Item {item.id}</div>}
        ></ReorderList>
      </div>
    </div>
  );
}

export { ItemList };
