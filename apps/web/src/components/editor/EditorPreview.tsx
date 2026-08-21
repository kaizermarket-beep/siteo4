"use client";

import { useState } from "react";
import { useEditorStore } from "./editor-context";
import { BlockRenderer } from "@/components/blocks";
import { SiteNav } from "@/components/site/SiteNav";

export function EditorPreview({
  siteName,
  primaryColor,
  mode,
}: {
  siteName: string;
  primaryColor?: string;
  mode?: "light" | "dark";
}) {
  const blocks = useEditorStore((s) => s.blocks);
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const activePage = pages.find((p) => p.id === activePageId);
  const visible = blocks
    .filter((b) => b.pageId === activePageId && b.isVisible)
    .sort((a, b) => a.position - b.position);

  // Same rule as the published site: a page other than the home page shows
  // the home page's footer, so the preview matches what visitors will see.
  const homePage = pages.find((p) => p.slug === "");
  const inheritedFooter =
    homePage && homePage.id !== activePageId
      ? blocks
          .filter((b) => b.pageId === homePage.id && b.blockType === "footer" && b.isVisible)
          .sort((a, b) => a.position - b.position)[0]
      : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setDevice("desktop")}
          className={`rounded px-2 py-1 text-xs ${device === "desktop" ? "bg-neutral-900 text-white" : "bg-neutral-100"}`}
        >
          Ordinateur
        </button>
        <button
          type="button"
          onClick={() => setDevice("mobile")}
          className={`rounded px-2 py-1 text-xs ${device === "mobile" ? "bg-neutral-900 text-white" : "bg-neutral-100"}`}
        >
          Mobile
        </button>
      </div>
      <div className="flex justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800">
        <div
          className={`w-full overflow-y-auto ${mode === "dark" ? "dark bg-neutral-950" : "bg-white"}`}
          style={{
            maxWidth: device === "mobile" ? 390 : "100%",
            height: "calc(100vh - 260px)",
            ...(primaryColor ? ({ "--site-accent": primaryColor } as React.CSSProperties) : {}),
          }}
        >
          <SiteNav
            siteName={siteName}
            pages={pages.map((p) => ({ slug: p.slug, title: p.title }))}
            activeSlug={activePage?.slug ?? ""}
            onNavigate={(slug) => {
              const target = pages.find((p) => p.slug === slug);
              if (target) setActivePage(target.id);
            }}
          />
          {visible.map((block) => (
            <BlockRenderer key={block.id} blockType={block.blockType} content={block.content} />
          ))}
          {inheritedFooter && (
            <BlockRenderer
              blockType={inheritedFooter.blockType}
              content={inheritedFooter.content}
            />
          )}
        </div>
      </div>
    </div>
  );
}
