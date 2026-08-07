"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "./editor-context";
import { toggleBlockVisibility, reorderBlocks } from "@/server-actions/blocks";
import { blockTypeDefs } from "@/templates/block-type-defs";

const labelByType = Object.fromEntries(blockTypeDefs.map((d) => [d.type, d.label]));

function SortableRow({
  id,
  label,
  isVisible,
  isSelected,
  onSelect,
  onToggleVisible,
}: {
  id: string;
  label: string;
  isVisible: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisible: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
        isSelected ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        aria-label="Réordonner"
        className="cursor-grab touch-none text-neutral-400"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <button type="button" onClick={onSelect} className="flex-1 text-left">
        {label}
      </button>
      <button
        type="button"
        onClick={onToggleVisible}
        title={isVisible ? "Masquer" : "Afficher"}
        className="text-neutral-500 hover:text-neutral-900"
      >
        {isVisible ? "👁" : "🚫"}
      </button>
    </li>
  );
}

export function BlockList({ siteId }: { siteId: string }) {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const setBlockOrder = useEditorStore((s) => s.setBlockOrder);
  const setBlockVisibility = useEditorStore((s) => s.setBlockVisibility);
  const [savingOrder, setSavingOrder] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = sorted.map((b) => b.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newOrder = arrayMove(ids, oldIndex, newIndex);

    setBlockOrder(newOrder);
    setSavingOrder(true);
    try {
      await reorderBlocks(siteId, newOrder);
    } finally {
      setSavingOrder(false);
    }
  }

  async function handleToggleVisible(id: string, current: boolean) {
    setBlockVisibility(id, !current);
    await toggleBlockVisibility(id, !current);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-700">Sections</h2>
        {savingOrder && <span className="text-xs text-neutral-400">Enregistrement…</span>}
      </div>
      <DndContext
        id="block-list-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sorted.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-1">
            {sorted.map((block) => (
              <SortableRow
                key={block.id}
                id={block.id}
                label={labelByType[block.blockType] ?? block.blockType}
                isVisible={block.isVisible}
                isSelected={block.id === selectedBlockId}
                onSelect={() => selectBlock(block.id)}
                onToggleVisible={() => handleToggleVisible(block.id, block.isVisible)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
