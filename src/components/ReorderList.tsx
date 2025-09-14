import { Flip } from "gsap/all";
import { useImperativeHandle, useLayoutEffect, useRef, type ReactNode, type Ref, type RefObject } from "react";
import type { ReorderHandler } from "../types";
import { ReorderItem } from "./ReorderItem";


// TODO: remove need to call batch.getState() after scheduling animations

type ItemWithId = { id: string };

type Props<T extends ItemWithId> = {
  items: T[],
  itemRefs: RefObject<{ [id in string]: HTMLElement | null }>,
  renderItem: (item: T) => ReactNode,
  /** use to apply style to container of item list. */
  className?: string;
  onReorder: (item: T[]) => void;
  ref?: React.Ref<ReorderListRef>;
}

function ReorderList<T extends ItemWithId>({ items, renderItem, className, onReorder, ref, itemRefs }: Props<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const q = gsap.utils.selector(containerRef);
  const batch = Flip.batch(flipBatchName);
  // const itemRefs = useRef<{ [key in string]: HTMLElement | null }>({});

  useLayoutEffect(() => {
    batch.run(true);
  })

  // expose method to parent
  useImperativeHandle(ref, () => {
    return {
      scheduleListAnimation: () => {
        scheduleAnimationForSelector(() => Object.values(itemRefs.current));
      },
      scheduleAnimationForSelector
    }
  }, [itemRefs]);


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

    scheduleAnimationForSelector(
      () => [...Object.values(itemRefs.current).filter(item => item != draggedElement), dragCopy],
      () => Object.values(itemRefs.current),
    );
    batch.getState();

    onReorder(next);
  }

  const itemList = items.map((item) => (
    <ReorderItem
      key={item.id}
      id={item.id}
      itemRefs={itemRefs}
      onItemInsert={reOrderItems}
    >
      {renderItem(item)}
    </ReorderItem>
  ));

  return <div ref={containerRef} className={className} data-swd-space>
    {itemList}
  </div>;
}


export type ReorderListRef = {
  /** note: make sure to call batch.getState(); after schduleing all animation. */
  scheduleListAnimation: () => void;
  /** schedule animation of element from this component with element in list. 
   * 
   * note: make sure to call batch.getState(); after schduleing all animation.
  */
  scheduleAnimationForSelector: (targetGetter: () => gsap.DOMTarget, targetToAnimate?: () => gsap.DOMTarget) => void;
}

export const flipBatchName = "animate-reorder";

const scheduleAnimationForSelector = (targetGetter: () => gsap.DOMTarget, targetToAnimate?: () => gsap.DOMTarget) => {
  const batch = Flip.batch(flipBatchName);
  batch.add({
    getState: () => {
      return Flip.getState(targetGetter());
    },
    animate: (self) => {
      if (!self.state) return;
      Flip.from(self.state, {
        targets: (targetToAnimate ?? targetGetter)(),
        duration: 0.5,
        ease: "power1.inOut",
        stagger: 0.02,
        scale: true,
        prune: true,
      });
    },
    once: true
  });
}


export { ReorderList };
