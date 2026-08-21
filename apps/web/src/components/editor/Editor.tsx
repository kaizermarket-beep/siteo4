"use client";

import { useState } from "react";
import { createEditorStore, type EditorBlock, type EditorPage } from "./editor-store";
import { EditorStoreProvider } from "./editor-context";
import { BlockList } from "./BlockList";
import { BlockEditorPanel } from "./BlockEditorPanel";
import { EditorPreview } from "./EditorPreview";
import { PageTabs } from "./PageTabs";

export function Editor({
  siteId,
  siteName,
  initialBlocks,
  initialPages,
  primaryColor,
  mode,
}: {
  siteId: string;
  siteName: string;
  initialBlocks: EditorBlock[];
  initialPages: EditorPage[];
  primaryColor?: string;
  mode?: "light" | "dark";
}) {
  const [store] = useState(() => createEditorStore(initialBlocks, initialPages));

  return (
    <EditorStoreProvider value={store}>
      <div className="flex flex-col gap-5">
        <PageTabs siteId={siteId} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_320px_1fr]">
          <BlockList siteId={siteId} />
          <div className="rounded-lg border border-neutral-200 p-4">
            <BlockEditorPanel />
          </div>
          <EditorPreview siteName={siteName} primaryColor={primaryColor} mode={mode} />
        </div>
      </div>
    </EditorStoreProvider>
  );
}
