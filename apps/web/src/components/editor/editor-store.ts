import { create } from "zustand";
import type { BlockType } from "@/validation/blocks";

export type EditorBlock = {
  id: string;
  blockType: BlockType;
  position: number;
  isVisible: boolean;
  content: Record<string, unknown>;
};

type EditorState = {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  selectBlock: (id: string | null) => void;
  setBlockOrder: (orderedIds: string[]) => void;
  setBlockVisibility: (id: string, isVisible: boolean) => void;
  setBlockContent: (id: string, content: Record<string, unknown>) => void;
};

export function createEditorStore(initialBlocks: EditorBlock[]) {
  return create<EditorState>((set) => ({
    blocks: initialBlocks,
    selectedBlockId: null,
    selectBlock: (id) => set({ selectedBlockId: id }),
    setBlockOrder: (orderedIds) =>
      set((state) => {
        const byId = new Map(state.blocks.map((b) => [b.id, b]));
        return {
          blocks: orderedIds
            .map((id, i) => {
              const block = byId.get(id);
              return block ? { ...block, position: (i + 1) * 10 } : null;
            })
            .filter((b): b is EditorBlock => b !== null),
        };
      }),
    setBlockVisibility: (id, isVisible) =>
      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === id ? { ...b, isVisible } : b)),
      })),
    setBlockContent: (id, content) =>
      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
      })),
  }));
}

export type EditorStore = ReturnType<typeof createEditorStore>;
