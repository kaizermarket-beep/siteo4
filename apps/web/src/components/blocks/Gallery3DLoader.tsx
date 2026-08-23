"use client";

import dynamic from "next/dynamic";
import type { GalleryContent } from "@/validation/blocks";

// Same reason as HeroBackdrop: a Server Component that dynamically imports a
// Client Component gets no code splitting, so the dynamic() call has to live
// on the client side of the boundary.
const Gallery3D = dynamic(() => import("./Gallery3D"));

export function Gallery3DLoader({ content }: { content: GalleryContent }) {
  return <Gallery3D content={content} />;
}
