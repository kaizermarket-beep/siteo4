"use client";

import { useState, useTransition } from "react";
import { publishSite, unpublishSite } from "@/server-actions/publish";
import type { SiteStatus } from "@/lib/db/schema";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
const PROTOCOL = ROOT_DOMAIN?.startsWith("localhost") ? "http" : "https";

export function PublishButton({
  siteId,
  slug,
  initialStatus,
}: {
  siteId: string;
  slug: string;
  initialStatus: SiteStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const publicUrl = `${PROTOCOL}://${slug}.${ROOT_DOMAIN}`;

  function handleToggle() {
    startTransition(async () => {
      if (status === "published") {
        await unpublishSite(siteId);
        setStatus("draft");
      } else {
        await publishSite(siteId);
        setStatus("published");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {status === "published" && (
        <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-600 underline">
          {slug}.{ROOT_DOMAIN} ↗
        </a>
      )}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`rounded-md px-4 py-1.5 text-sm font-medium disabled:opacity-50 ${
          status === "published"
            ? "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        }`}
      >
        {isPending
          ? "…"
          : status === "published"
            ? "Dépublier"
            : "Publier"}
      </button>
    </div>
  );
}
