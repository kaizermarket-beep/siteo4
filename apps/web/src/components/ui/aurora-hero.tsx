import Link from "next/link";
import { Button } from "@/components/ui/button";

// Slow-moving blurred gradient blobs behind the hero content, and a
// plain-CSS fade-up for the text/button (see .animate-fade-up in
// globals.css). Deliberately no Framer Motion here: after two rounds of its
// initial/animate mount transitions getting stuck at their initial
// (invisible) state — reproducibly, even on a fresh page load — CSS
// animations are the reliable choice for anything that must be visible on
// load. Framer Motion remains fine for interactive/JS-driven animation
// elsewhere (e.g. the block editor's drag-and-drop).
function AuroraBlobs() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div
                className="absolute -top-1/3 -left-1/4 h-[55vw] w-[55vw] max-h-[700px] max-w-[700px] rounded-full
                bg-gradient-to-br from-indigo-300/40 via-violet-200/30 to-transparent blur-3xl
                dark:from-indigo-500/20 dark:via-violet-500/10 animate-[aurora-drift-1_22s_ease-in-out_infinite]"
            />
            <div
                className="absolute -bottom-1/3 -right-1/4 h-[50vw] w-[50vw] max-h-[650px] max-w-[650px] rounded-full
                bg-gradient-to-tr from-sky-200/40 via-cyan-100/30 to-transparent blur-3xl
                dark:from-sky-500/20 dark:via-cyan-500/10 animate-[aurora-drift-2_26s_ease-in-out_infinite]"
            />
            <div
                className="absolute top-1/4 left-1/2 h-[35vw] w-[35vw] max-h-[450px] max-w-[450px] -translate-x-1/2 rounded-full
                bg-gradient-to-b from-amber-100/30 to-transparent blur-3xl
                dark:from-amber-500/10 animate-[aurora-pulse_18s_ease-in-out_infinite]"
            />
        </div>
    );
}

export function AuroraHero({
    title = "Aurora Hero",
    subtitle,
    ctaLabel = "Get Started",
    ctaHref = "#",
    minHeight = "min-h-screen",
}: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    minHeight?: string;
}) {
    return (
        <div
            className={`relative ${minHeight} w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950`}
        >
            <AuroraBlobs />

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1
                        className="animate-fade-up text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter text-neutral-900 dark:text-white"
                        style={{ animationDelay: "0s" }}
                    >
                        {title}
                    </h1>

                    {subtitle && (
                        <p
                            className="animate-fade-up mb-8 text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto"
                            style={{ animationDelay: "0.15s" }}
                        >
                            {subtitle}
                        </p>
                    )}

                    <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
                        <Button
                            asChild
                            className="rounded-full px-8 py-6 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Link href={ctaHref}>
                                <span>{ctaLabel}</span>
                                <span className="ml-3">→</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
