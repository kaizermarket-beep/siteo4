"use client";

import { useState, useTransition } from "react";
import { useEditorStore } from "./editor-context";
import { createPage, deletePage, renamePage } from "@/server-actions/pages";
import type { BlockType } from "@/validation/blocks";

// The pages of the site, as tabs. Switching a tab changes what the section
// list and the preview show; nothing is loaded, every page's blocks are
// already in the store.
export function PageTabs({ siteId }: { siteId: string }) {
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const renamePageLocal = useEditorStore((s) => s.renamePage);
  const removePage = useEditorStore((s) => s.removePage);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  function handleAdd(title: string) {
    setAdding(false);
    setNewTitle("");
    if (!title.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const { page, blocks } = await createPage(siteId, title);
        addPage(
          { id: page.id, slug: page.slug, title: page.title, position: page.position },
          blocks.map((b) => ({
            id: b.id,
            pageId: page.id,
            blockType: b.blockType as BlockType,
            position: b.position,
            isVisible: b.isVisible,
            content: b.content as Record<string, unknown>,
          }))
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "La page n'a pas pu être créée.");
      }
    });
  }

  function commitRename(pageId: string) {
    const title = draftTitle.trim();
    setEditingId(null);
    const current = pages.find((p) => p.id === pageId);
    if (!title || !current || title === current.title) return;

    const previous = current.title;
    renamePageLocal(pageId, title);
    setError(null);
    startTransition(async () => {
      try {
        await renamePage(pageId, title);
      } catch (e) {
        renamePageLocal(pageId, previous);
        setError(e instanceof Error ? e.message : "Le nom n'a pas pu être enregistré.");
      }
    });
  }

  function handleDelete(pageId: string, title: string) {
    if (!window.confirm(`Supprimer la page « ${title} » et tout son contenu ?`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deletePage(pageId);
        removePage(pageId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "La page n'a pas pu être supprimée.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 pb-2">
        <span className="mr-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
          Pages
        </span>

        {pages.map((page) => {
          const isActive = page.id === activePageId;
          const isHome = page.slug === "";

          if (editingId === page.id) {
            return (
              <input
                key={page.id}
                autoFocus
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={() => commitRename(page.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") setEditingId(null);
                }}
                maxLength={40}
                className="w-32 rounded-md border border-neutral-900 px-2 py-1 text-sm outline-none"
              />
            );
          }

          return (
            <span key={page.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setActivePage(page.id)}
                onDoubleClick={() => {
                  setDraftTitle(page.title);
                  setEditingId(page.id);
                }}
                title="Double-cliquez pour renommer"
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {isHome ? "🏠 " : ""}
                {page.title}
              </button>
              {!isHome && isActive && (
                <button
                  type="button"
                  onClick={() => handleDelete(page.id, page.title)}
                  aria-label={`Supprimer la page ${page.title}`}
                  className="ml-1 px-1 text-neutral-400 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </span>
          );
        })}

        {adding ? (
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={(e) => handleAdd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setNewTitle("");
                setAdding(false);
              }
            }}
            placeholder="Prestations"
            maxLength={40}
            className="ml-1 w-36 rounded-md border border-neutral-900 px-2 py-1 text-sm outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={pending}
            className="ml-1 rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 disabled:opacity-50"
          >
            + Page
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-xs text-neutral-400">
          Le menu de navigation du site reprend automatiquement ces pages. Double-cliquez sur un
          onglet pour le renommer.
        </p>
      )}
    </div>
  );
}
