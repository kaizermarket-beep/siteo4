import { create } from "zustand";
import type { BlockType } from "@/validation/blocks";

export type EditorPage = {
  id: string;
  slug: string;
  title: string;
  position: number;
};

export type EditorBlock = {
  id: string;
  pageId: string;
  blockType: BlockType;
  position: number;
  isVisible: boolean;
  content: Record<string, unknown>;
};

type EditorState = {
  // Every page's blocks live in one list; the editor shows the active page's
  // slice. Keeping them together means switching pages costs nothing and
  // never loses an unsaved edit made on another page.
  blocks: EditorBlock[];
  pages: EditorPage[];
  activePageId: string;
  selectedBlockId: string | null;
  setActivePage: (pageId: string) => void;
  addPage: (page: EditorPage, blocks: EditorBlock[]) => void;
  renamePage: (pageId: string, title: string) => void;
  removePage: (pageId: string) => void;
  selectBlock: (id: string | null) => void;
  setBlockOrder: (orderedIds: string[]) => void;
  setBlockVisibility: (id: string, isVisible: boolean) => void;
  setBlockContent: (id: string, content: Record<string, unknown>) => void;
};

export function createEditorStore(initialBlocks: EditorBlock[], initialPages: EditorPage[]) {
  const home = initialPages.find((p) => p.slug === "") ?? initialPages[0];

  return create<EditorState>((set) => ({
    blocks: initialBlocks,
    pages: initialPages,
    activePageId: home?.id ?? "",
    selectedBlockId: null,
    setActivePage: (pageId) => set({ activePageId: pageId, selectedBlockId: null }),
    addPage: (page, blocks) =>
      set((state) => ({
        pages: [...state.pages, page].sort((a, b) => a.position - b.position),
        blocks: [...state.blocks, ...blocks],
        activePageId: page.id,
        selectedBlockId: null,
      })),
    renamePage: (pageId, title) =>
      set((state) => ({
        pages: state.pages.map((p) => (p.id === pageId ? { ...p, title } : p)),
      })),
    removePage: (pageId) =>
      set((state) => {
        const pages = state.pages.filter((p) => p.id !== pageId);
        const fallback = pages.find((p) => p.slug === "") ?? pages[0];
        return {
          pages,
          blocks: state.blocks.filter((b) => b.pageId !== pageId),
          activePageId: state.activePageId === pageId ? (fallback?.id ?? "") : state.activePageId,
          selectedBlockId: null,
        };
      }),
    selectBlock: (id) => set({ selectedBlockId: id }),
    setBlockOrder: (orderedIds) =>
      set((state) => {
        const byId = new Map(state.blocks.map((b) => [b.id, b]));
        const reordered = new Map(
          orderedIds
            .map((id, i) => {
              const block = byId.get(id);
              return block ? ([id, { ...block, position: (i + 1) * 10 }] as const) : null;
            })
            .filter((e): e is readonly [string, EditorBlock] => e !== null)
        );
        // Only the reordered page's blocks change; the others keep their own
        // positions, which are numbered independently per page.
        return { blocks: state.blocks.map((b) => reordered.get(b.id) ?? b) };
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
