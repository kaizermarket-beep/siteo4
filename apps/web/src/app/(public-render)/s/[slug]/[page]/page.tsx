import { notFound } from "next/navigation";
import { SiteRender } from "@/components/site/SiteRender";
import { loadPublishedPage } from "@/lib/site-pages";

export const revalidate = 3600;

type Params = Promise<{ slug: string; page: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, page } = await params;
  const data = await loadPublishedPage(slug, page);
  if (!data) return {};
  return { title: data.page.seoTitle || `${data.page.title} — ${data.site.name}` };
}

export default async function PublicSiteSubPage({ params }: { params: Params }) {
  const { slug, page } = await params;
  const data = await loadPublishedPage(slug, page);
  if (!data) notFound();

  return (
    <SiteRender
      siteName={data.site.name}
      theme={data.site.theme as { primaryColor?: string; mode?: "light" | "dark" } | null}
      navPages={data.navPages}
      activeSlug={data.page.slug}
      blocks={data.blocks}
      inheritedFooter={data.inheritedFooter}
    />
  );
}
