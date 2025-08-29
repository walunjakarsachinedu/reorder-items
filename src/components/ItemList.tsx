import { useRef, useState } from "react";
import type { ReorderHandler } from "../types";
import { Item } from "./Item";
import { Flip } from "gsap/all";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./ItemList.css";


function ItemList() {
  const containerRef = useRef<HTMLDivElement|null>(null);
  const q = gsap.utils.selector(containerRef);
  const [items, setItems] = useState<number[]>([1,2,3,4,5,6,7,8,9,10]);
  const [flipState, setFlipState] = useState<Flip.FlipState|null>(null);
  const [layout, setLayout] = useState<"flex-row-wrap"|"flex-column-wrap">("flex-row-wrap");
  const [sortOrder, setSortOrder] = useState<"asc"|"desc"|null>("asc");


  useGSAP(() => {
    if(!flipState) return;

    Flip.from(flipState, {
      targets: ".item, .btn",
      duration: 0.5,
      ease: "power1.inOut",
      stagger: 0.02,
      scale: true,
      prune: true
    });
  }, [flipState]);


  const reOrderItems: ReorderHandler = (itemId, dropItemId, pos) => {
    const next = [...items];
    const dropIdx = next.indexOf(dropItemId);
    const anchorIdx = next.indexOf(itemId);

    if (dropIdx === -1 || anchorIdx == -1) return;

    const insertAt = pos === "hr" ? anchorIdx + 1 : anchorIdx;

    if(dropIdx == anchorIdx) return;
    
    setSortOrder(null);
    next.splice(insertAt, 0, dropItemId);
    next.splice(dropIdx > insertAt ? dropIdx + 1 : dropIdx, 1);
    
    setFlipState(Flip.getState(q(".item")));
    setItems(next);
  }

  const itemList = items.map((id) => (
    <Item key={id} id={id} onItemInsert={reOrderItems} />
  ));

  const toggleLayout = () => {
    setFlipState(Flip.getState(q(".item, .btn")));
    setLayout(layout == "flex-row-wrap"? "flex-column-wrap": "flex-row-wrap");
  }

  const sortLayout = () => {
    const order = !sortOrder ? "asc" : sortOrder == "asc" ? "desc" : "asc";
    setFlipState(Flip.getState(q(".item, .btn")));
    setItems(items.sort((a,b) => order == "asc" ? a-b : b-a));
    setSortOrder(order);
  }

  return (
    <div ref={containerRef} className="center">
        <button className="btn" onClick={sortLayout}>
          sort items { sortOrder && (sortOrder == "asc" ? "↑" : "↓") }
        </button>
        <button className="btn" onClick={toggleLayout}>toggle layout</button>
      <div className={layout} data-swd-space>
        {itemList}
      </div>
    </div>
  );
}

export { ItemList };