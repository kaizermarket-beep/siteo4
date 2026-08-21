"use client";

import { useState } from "react";
import { pageHref, type NavPage } from "@/lib/site-nav";

// The navigation bar of a published multi-page site.
//
// It is not a block. It is derived from the site's pages, so it can never
// list a page that was deleted or miss one that was added — the failure mode
// of every hand-maintained nav. Nothing renders for a single-page site.
//
// Two modes, one component: on the public site the entries are links; inside
// the editor preview `onNavigate` is passed instead and they switch the
// previewed page in place, since there is nothing to navigate to yet.
export function SiteNav({
  siteName,
  pages,
  activeSlug,
  onNavigate,
  preview = false,
}: {
  siteName: string;
  pages: NavPage[];
  activeSlug: string;
  onNavigate?: (slug: string) => void;
  /** Show the bar without making it clickable — for template previews, where
   *  following a link would take the visitor off the page they are browsing. */
  preview?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (pages.length < 2) return null;

  const linkClass = (slug: string) =>
    `relative py-1 text-sm transition-colors ${
      slug === activeSlug
        ? "text-neutral-900 dark:text-white"
        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
    }`;

  const underline = (slug: string) =>
    slug === activeSlug ? (
      <span
        className="absolute -bottom-px left-0 h-px w-full"
        style={{ backgroundColor: "var(--site-accent, #171717)" }}
      />
    ) : null;

  function entry(page: NavPage, onMobile: boolean) {
    const content = (
      <>
        {page.title}
        {!onMobile && underline(page.slug)}
      </>
    );

    if (preview) {
      return (
        <span key={page.slug || "home"} className={linkClass(page.slug)}>
          {content}
        </span>
      );
    }

    if (onNavigate) {
      return (
        <button
          key={page.slug || "home"}
          type="button"
          onClick={() => {
            onNavigate(page.slug);
            setOpen(false);
          }}
          className={linkClass(page.slug)}
        >
          {content}
        </button>
      );
    }

    return (
      <a
        key={page.slug || "home"}
        href={pageHref(page.slug)}
        className={linkClass(page.slug)}
        onClick={() => setOpen(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {preview ? (
          <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
            {siteName}
          </span>
        ) : onNavigate ? (
          <button
            type="button"
            onClick={() => onNavigate("")}
            className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white"
          >
            {siteName}
          </button>
        ) : (
          <a
            href={pageHref("")}
            className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white"
          >
            {siteName}
          </a>
        )}

        <nav className="hidden items-center gap-7 sm:flex">{pages.map((p) => entry(p, false))}</nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={preview}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 sm:hidden dark:text-neutral-200 dark:hover:bg-white/10"
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
            <span className="block h-px w-5 bg-current" />
          </span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col items-start gap-3 border-t border-neutral-200/70 px-6 py-4 sm:hidden dark:border-white/10">
          {pages.map((p) => entry(p, true))}
        </nav>
      )}
    </header>
  );
}
