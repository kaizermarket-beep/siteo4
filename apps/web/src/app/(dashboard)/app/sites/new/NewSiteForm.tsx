"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { createSite } from "@/server-actions/sites";

type TemplateOption = {
  slug: string;
  name: string;
  description: string;
  isPremium: boolean;
  pageCount: number;
  accentColor?: string;
  mode?: "light" | "dark";
  icon: string;
  category: string;
};

type CategoryOption = { key: string; label: string; icon: string };

// Subtle 3D tilt on mouse move, imperative (no re-render) for a snappy
// 21st.dev-style "alive" card feel without fighting React's render cycle.
function handleTilt(e: MouseEvent<HTMLButtonElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  const rx = (0.5 - py) * 8;
  const ry = (px - 0.5) * 8;
  card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
}

function resetTilt(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.transform = "";
}

// Pill filter: switches which single category's templates are shown, so
// picking a métier never surfaces every other métier's suggestions too.
function CategoryNav({
  categories,
  activeKey,
  onSelect,
}: {
  categories: CategoryOption[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const activeEl = pillRefs.current[activeKey];
    if (!list || !activeEl) return;
    const listRect = list.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    setIndicator({ left: elRect.left - listRect.left + list.scrollLeft, width: elRect.width });
  }, [activeKey]);

  return (
    <div
      ref={listRef}
      className="sticky top-0 z-30 -mx-1 flex gap-1.5 overflow-x-auto rounded-full border border-neutral-200 bg-white/90 p-1.5 backdrop-blur relative"
    >
      {indicator && (
        <span
          className="absolute top-1.5 bottom-1.5 rounded-full bg-neutral-900 transition-all duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden
        />
      )}
      {categories.map((cat) => (
        <button
          key={cat.key}
          ref={(el) => {
            pillRefs.current[cat.key] = el;
          }}
          type="button"
          onClick={() => onSelect(cat.key)}
          className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            activeKey === cat.key ? "text-white" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// Clicking a card creates the site right away and lands in the editor — no
// separate "select, then fill a form, then submit" step. Each card is its
// own tiny form; locked (premium, no entitlement) ones render as an inert
// div instead so there's nothing to submit.
function TemplateCard({
  template,
  locked,
  submitting,
  onSubmitStart,
}: {
  template: TemplateOption;
  locked: boolean;
  submitting: boolean;
  onSubmitStart: () => void;
}) {
  const accent = template.accentColor ?? "#171717";
  const dark = template.mode === "dark";

  const cardClassName = `group relative flex w-full flex-col overflow-hidden rounded-xl border text-left text-sm transition-[transform,box-shadow,opacity] duration-150 will-change-transform ${
    locked
      ? "cursor-not-allowed border-neutral-200 opacity-50"
      : "cursor-pointer border-neutral-200 hover:border-transparent"
  } ${dark ? "bg-neutral-950" : "bg-white"} ${submitting ? "opacity-60" : ""}`;

  const content = (
    <>
      <div
        className="relative flex h-20 items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 40%, black))`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl backdrop-blur-sm">
          {template.icon}
        </span>
        {template.isPremium && (
          <span
            className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
              locked ? "bg-black/30" : "bg-black/40"
            }`}
          >
            {locked ? "Premium requis" : "Premium"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${dark ? "text-white" : "text-neutral-900"}`}>{template.name}</span>
          {template.pageCount > 1 && (
            <span
              className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${
                dark ? "border-white/25 text-neutral-300" : "border-neutral-300 text-neutral-600"
              }`}
            >
              {template.pageCount} pages
            </span>
          )}
        </div>
        <p className={`${dark ? "text-neutral-400" : "text-neutral-600"} flex-1`}>{template.description}</p>
        {submitting && <span className="mt-2 text-xs text-neutral-500">Création…</span>}
      </div>
    </>
  );

  if (locked) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <form action={createSite} onSubmit={onSubmitStart}>
      <input type="hidden" name="templateSlug" value={template.slug} />
      <button
        type="submit"
        disabled={submitting}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        className={cardClassName}
      >
        {content}
      </button>
    </form>
  );
}

export function NewSiteForm({
  templates,
  categories,
  allowsPremiumTemplates,
  preselectedTemplate,
}: {
  templates: TemplateOption[];
  categories: CategoryOption[];
  allowsPremiumTemplates: boolean;
  preselectedTemplate?: string;
}) {
  const [submittingSlug, setSubmittingSlug] = useState<string | null>(null);

  const grouped = useMemo(
    () =>
      categories
        .map((cat) => ({ ...cat, templates: templates.filter((t) => t.category === cat.key) }))
        .filter((g) => g.templates.length > 0),
    [categories, templates]
  );

  const initialCategory =
    templates.find((t) => t.slug === preselectedTemplate)?.category ?? grouped[0]?.key ?? "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const activeGroup = grouped.find((g) => g.key === activeCategory) ?? grouped[0];

  return (
    <div className="flex flex-col gap-5">
      <CategoryNav categories={grouped} activeKey={activeCategory} onSelect={setActiveCategory} />

      {activeGroup && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-neutral-900">
            <span>{activeGroup.icon}</span>
            {activeGroup.label}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeGroup.templates.map((template) => (
              <TemplateCard
                key={template.slug}
                template={template}
                locked={template.isPremium && !allowsPremiumTemplates}
                submitting={submittingSlug === template.slug}
                onSubmitStart={() => setSubmittingSlug(template.slug)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
