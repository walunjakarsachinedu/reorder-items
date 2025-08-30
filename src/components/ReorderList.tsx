import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { useImperativeHandle, useRef, useState, type ReactNode } from "react";
import type { ReorderHandler } from "../types";
import { ReorderItem } from "./ReorderItem";

export type ReorderListRef = {
  /** record state to animate changes in item list. */
  recordItemState: () => void
}

type ItemWithId = { id: string };
type Props<T extends ItemWithId> = {
  items: T[]
  renderItem: (item: T) => ReactNode,
  /** use to apply style to container of item list. */
  className?: string;
  /** use to apply style to wrapper of rendered item. */
  itemClassName?: string;
  onReorder: (item: T[]) => void;
  ref?: React.Ref<ReorderListRef>;
}

function ReorderList<T extends ItemWithId>({ items, renderItem, className, itemClassName, onReorder, ref }: Props<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const q = gsap.utils.selector(containerRef);
  const [flipState, setFlipState] = useState<Flip.FlipState | null>(null);


  useGSAP(() => {
    if (!flipState) return;

    Flip.from(flipState, {
      targets: q(".item"),
      duration: 0.5,
      ease: "power1.inOut",
      stagger: 0.02,
      scale: true,
      prune: true,
    });
  }, [flipState]);

  // expose method to parent
  useImperativeHandle(ref, () => ({
    recordItemState: () => {
      setFlipState(Flip.getState([...q(".item")]));
    }
  }));


  const reOrderItems: ReorderHandler = ({ dropItemId, dragItemId, pos, dragCopy, draggedElement }) => {
    const next = [...items];
    const dropItem = next.find(item => item.id == dropItemId);
    const dragItem = next.find(item => item.id == dragItemId);
    const dragItemIdx = next.findIndex(item => item.id == dragItemId);
    const dropItemIdx = next.findIndex(item => item.id == dropItemId);
    const insertAt = pos === "hr" ? dropItemIdx + 1 : dropItemIdx;


    // skip re-order for dropping in same position
    if (
      !dropItem || !dragItem ||
      dragItemIdx == -1 || dropItemIdx == -1 ||
      dragItemIdx == dropItemIdx ||
      dragItemIdx == insertAt ||
      dragItemIdx + 1 == dropItemIdx && pos == "hl"
    ) return;

    next.splice(insertAt, 0, dragItem);
    next.splice(dragItemIdx > insertAt ? dragItemIdx + 1 : dragItemIdx, 1);

    setFlipState(Flip.getState([...q(".item").filter(item => item != draggedElement), dragCopy]));
    onReorder(next);
  }

  const recordFliptState = () => setFlipState(Flip.getState([...q(".item")]));

  const itemList = items.map((item) => (
    <ReorderItem key={item.id} id={item.id} onItemInsert={reOrderItems} className={itemClassName}>
      {renderItem(item)}
    </ReorderItem>
  ));

  return <div ref={containerRef} className={className} data-swd-space>
    {itemList}
  </div>;
}

export { ReorderList };
