import { notFound } from "next/navigation";
import { SiteRender } from "@/components/site/SiteRender";
import { HOME_PAGE_SLUG, loadPublishedPage } from "@/lib/site-pages";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadPublishedPage(slug, HOME_PAGE_SLUG);
  if (!data) return {};
  return { title: data.page.seoTitle || data.site.seoTitle || data.site.name };
}

export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadPublishedPage(slug, HOME_PAGE_SLUG);
  if (!data) notFound();

  return (
    <SiteRender
      siteName={data.site.name}
      theme={data.site.theme as { primaryColor?: string; mode?: "light" | "dark" } | null}
      navPages={data.navPages}
      activeSlug={HOME_PAGE_SLUG}
      blocks={data.blocks}
      inheritedFooter={data.inheritedFooter}
    />
  );
}
