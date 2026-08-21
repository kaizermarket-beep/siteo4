import type { CSSProperties } from "react";
import { BlockRenderer } from "@/components/blocks";
import type { NavPage } from "@/lib/site-nav";
import { SiteNav } from "./SiteNav";

type RenderableBlock = { id: string; blockType: string; content: unknown };

// The published site itself: theme wrapper, navigation, the page's blocks,
// and the footer the page inherits from the home page when it has none of
// its own. Shared by both public routes (home and interior pages) so the two
// can never drift apart.
export function SiteRender({
  siteName,
  theme,
  navPages,
  activeSlug,
  blocks,
  inheritedFooter,
}: {
  siteName: string;
  theme: { primaryColor?: string; mode?: "light" | "dark" } | null;
  navPages: NavPage[];
  activeSlug: string;
  blocks: RenderableBlock[];
  inheritedFooter: RenderableBlock | null;
}) {
  return (
    <div
      className={theme?.mode === "dark" ? "dark bg-neutral-950" : "bg-white"}
      style={theme?.primaryColor ? ({ "--site-accent": theme.primaryColor } as CSSProperties) : undefined}
    >
      <SiteNav siteName={siteName} pages={navPages} activeSlug={activeSlug} />
      {blocks.map((block) => (
        <BlockRenderer key={block.id} blockType={block.blockType} content={block.content} />
      ))}
      {inheritedFooter && (
        <BlockRenderer blockType={inheritedFooter.blockType} content={inheritedFooter.content} />
      )}
    </div>
  );
}
