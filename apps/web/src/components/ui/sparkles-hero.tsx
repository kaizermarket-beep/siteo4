"use client";

import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";

// Sparkles need a dark backdrop to read (white particles on white would be
// invisible) — this hero is intentionally dark-themed, unlike the rest of
// the (currently light) marketing page.
export function SparklesHero({
    title = "Sparkles",
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
            className={`relative ${minHeight} w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden`}
        >
            <div className="w-full absolute inset-0 h-full">
                <SparklesCore
                    id="siteo-hero-sparkles"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                    speed={1}
                />
            </div>

            <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center md:px-6">
                <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl">
                    {title}
                </h1>

                {subtitle && (
                    <p className="max-w-xl text-lg text-neutral-300">{subtitle}</p>
                )}

                <Button
                    asChild
                    className="rounded-full bg-white px-8 py-6 h-auto text-lg font-semibold text-slate-950 hover:bg-neutral-200"
                >
                    <Link href={ctaHref}>
                        <span>{ctaLabel}</span>
                        <span className="ml-3">→</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
