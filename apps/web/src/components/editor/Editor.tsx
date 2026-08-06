"use client";

import { useState } from "react";
import { createEditorStore, type EditorBlock } from "./editor-store";
import { EditorStoreProvider } from "./editor-context";
import { BlockList } from "./BlockList";
import { BlockEditorPanel } from "./BlockEditorPanel";
import { EditorPreview } from "./EditorPreview";

export function Editor({
  siteId,
  initialBlocks,
  primaryColor,
}: {
  siteId: string;
  initialBlocks: EditorBlock[];
  primaryColor?: string;
}) {
  const [store] = useState(() => createEditorStore(initialBlocks));

  return (
    <EditorStoreProvider value={store}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_320px_1fr]">
        <BlockList siteId={siteId} />
        <div className="rounded-lg border border-neutral-200 p-4">
          <BlockEditorPanel />
        </div>
        <EditorPreview primaryColor={primaryColor} />
      </div>
    </EditorStoreProvider>
  );
}
