"use client";

import { useCallback, useRef, useState } from "react";
import type { BeforeAfterContent } from "@/validation/blocks";

function BeforeAfterSlider({
  before,
  after,
  label,
}: {
  before: { url: string; alt: string };
  after: { url: string; alt: string };
  label?: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full touch-none overflow-hidden rounded-xl bg-neutral-900 select-none sm:aspect-[4/3]"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after.url}
        alt={after.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before.url}
        alt={before.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        Avant
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        Après
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg">
          <span aria-hidden className="text-sm">
            ⇔
          </span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Curseur avant / après"
        className="absolute inset-x-0 bottom-2 mx-auto w-[90%] opacity-0 focus-visible:opacity-100"
      />

      {label && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {label}
        </span>
      )}
    </div>
  );
}

export function BeforeAfterBlock({ content }: { content: BeforeAfterContent }) {
  return (
    <section className="bg-neutral-50 px-6 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-5xl">
        {content.title && (
          <h2 className="mb-3 text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h2>
        )}
        {content.description && (
          <p className="mx-auto mb-12 max-w-xl text-center text-neutral-600 dark:text-neutral-400">
            {content.description}
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, i) => (
            <BeforeAfterSlider
              key={i}
              before={item.beforeImage}
              after={item.afterImage}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
