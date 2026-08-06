"use client";

import { useState } from "react";
import { useEditorStore } from "./editor-context";
import { BlockRenderer } from "@/components/blocks";

export function EditorPreview({ primaryColor }: { primaryColor?: string }) {
  const blocks = useEditorStore((s) => s.blocks);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const visible = [...blocks].filter((b) => b.isVisible).sort((a, b) => a.position - b.position);

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
      <div className="flex justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div
          className="w-full overflow-y-auto"
          style={{
            maxWidth: device === "mobile" ? 390 : "100%",
            height: "calc(100vh - 220px)",
            ...(primaryColor ? ({ "--site-accent": primaryColor } as React.CSSProperties) : {}),
          }}
        >
          {visible.map((block) => (
            <BlockRenderer key={block.id} blockType={block.blockType} content={block.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
