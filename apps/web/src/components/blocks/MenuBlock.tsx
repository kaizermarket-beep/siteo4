"use client";

import { useId, useMemo, useState } from "react";
import type { MenuContent } from "@/validation/blocks";

// French numbers are stored as "01 23 45 67 89"; wa.me needs digits only,
// country code, no leading trunk zero.
function toWhatsAppDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("33")) return digits;
  if (digits.startsWith("0")) return `33${digits.slice(1)}`;
  return digits;
}

export function MenuBlock({ content }: { content: MenuContent }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  // Which tab is open. Clamped on render rather than reset in an effect: if
  // the owner deletes a category while the last tab is selected, the index
  // simply falls back to the last one that exists.
  const [tab, setTab] = useState(0);
  const canOrder = content.orderEnabled && content.orderPhone.trim().length > 0;
  const tabId = useId();
  const tabbed = content.layout === "tabs" && content.categories.length > 1;
  const activeTab = Math.min(tab, content.categories.length - 1);

  const cartCount = useMemo(() => Object.values(cart).reduce((sum, n) => sum + n, 0), [cart]);

  function addToCart(key: string) {
    setCart((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  }

  function removeFromCart(key: string) {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[key] ?? 0;
      if (current <= 1) {
        delete next[key];
      } else {
        next[key] = current - 1;
      }
      return next;
    });
  }

  const whatsAppHref = useMemo(() => {
    if (!canOrder || cartCount === 0) return undefined;
    const lines: string[] = ["Bonjour, je souhaite commander :"];
    content.categories.forEach((category, ci) => {
      category.items.forEach((item, ii) => {
        const qty = cart[`${ci}-${ii}`];
        if (qty) lines.push(`- ${qty}x ${item.name}`);
      });
    });
    lines.push("", "Merci de me confirmer la disponibilité et le total.");
    const digits = toWhatsAppDigits(content.orderPhone);
    return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [canOrder, cart, cartCount, content.categories, content.orderPhone]);

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-3xl">
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

        {tabbed && (
          // The scroll wrapper is what keeps six categories from pushing the
          // whole page sideways on a phone: the bar scrolls, the page does not.
          <div className="mb-10 -mx-6 overflow-x-auto px-6">
          <div
            role="tablist"
            aria-label={content.title || "Cartes"}
            className="mx-auto flex w-fit overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700"
          >
            {content.categories.map((category, ci) => {
              const selected = ci === activeTab;
              return (
                <button
                  key={ci}
                  type="button"
                  role="tab"
                  id={`${tabId}-tab-${ci}`}
                  aria-selected={selected}
                  aria-controls={`${tabId}-panel-${ci}`}
                  // Only the selected tab is reachable by Tab; the arrows move
                  // between them. That is the pattern assistive technology
                  // expects from a tablist, and it keeps a six-category card
                  // from costing six presses to walk past.
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(ci)}
                  onKeyDown={(e) => {
                    const last = content.categories.length - 1;
                    let next = activeTab;
                    if (e.key === "ArrowRight") next = activeTab === last ? 0 : activeTab + 1;
                    else if (e.key === "ArrowLeft") next = activeTab === 0 ? last : activeTab - 1;
                    else if (e.key === "Home") next = 0;
                    else if (e.key === "End") next = last;
                    else return;
                    e.preventDefault();
                    setTab(next);
                    document.getElementById(`${tabId}-tab-${next}`)?.focus();
                  }}
                  className={`px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
                    selected ? "text-white" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                  style={selected ? { backgroundColor: "var(--site-accent, #171717)" } : undefined}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
          </div>
        )}

        <div className="flex flex-col gap-10">
          {content.categories.map((category, ci) => (
            <div
              key={ci}
              hidden={tabbed && ci !== activeTab}
              {...(tabbed
                ? { role: "tabpanel", id: `${tabId}-panel-${ci}`, "aria-labelledby": `${tabId}-tab-${ci}` }
                : {})}
            >
              <h3
                className={`mb-4 border-b pb-2 text-sm font-semibold tracking-wide uppercase ${tabbed ? "sr-only" : ""}`}
                style={{ color: "var(--site-accent, #171717)", borderColor: "var(--site-accent, #171717)" }}
              >
                {category.name}
              </h3>
              <ul className="flex flex-col gap-4">
                {category.items.map((item, ii) => {
                  const key = `${ci}-${ii}`;
                  const qty = cart[key] ?? 0;
                  return (
                    <li key={ii} className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-neutral-900 dark:text-white">{item.name}</span>
                          <span className="flex-1 border-b border-dotted border-neutral-300 dark:border-neutral-700" />
                          <span className="font-medium whitespace-nowrap text-neutral-900 dark:text-white">
                            {item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>
                        )}
                      </div>
                      {canOrder && (
                        <div className="flex shrink-0 items-center gap-2 pt-0.5">
                          {qty > 0 && (
                            <>
                              <button
                                type="button"
                                onClick={() => removeFromCart(key)}
                                aria-label={`Retirer ${item.name}`}
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-sm text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
                              >
                                −
                              </button>
                              <span className="w-4 text-center text-sm tabular-nums text-neutral-700 dark:text-neutral-300">
                                {qty}
                              </span>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => addToCart(key)}
                            aria-label={`Ajouter ${item.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-white"
                            style={{ backgroundColor: "var(--site-accent, #171717)" }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {canOrder && cartCount > 0 && (
          <div className="sticky bottom-4 z-20 mt-10 flex items-center justify-between gap-4 rounded-full border border-neutral-200 bg-white/95 px-5 py-3 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              {cartCount} article{cartCount > 1 ? "s" : ""}
            </span>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--site-accent, #171717)" }}
            >
              Commander sur WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
