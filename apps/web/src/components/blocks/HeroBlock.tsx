import type { CSSProperties } from "react";
import type { HeroContent } from "@/validation/blocks";
import { SparklesCore } from "@/components/ui/sparkles";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import { SilkBackground } from "@/components/ui/silk-background";
import { GodRays } from "@/components/ui/god-rays";
import { BarberPole } from "@/components/ui/barber-pole";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { PulseFitHero } from "@/components/ui/pulse-fit-hero";

// Accent-colored blurred blobs + dot grid, animated with the same drift
// keyframes as the marketing aurora hero (globals.css) — pure CSS, no JS, so
// it renders identically for every published site regardless of métier.
// Colors derive from --site-accent (per-template theme) via color-mix().
function HeroBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-1/3 -left-1/4 h-[55vw] w-[55vw] max-h-[600px] max-w-[600px] animate-[aurora-drift-1_22s_ease-in-out_infinite] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #171717) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[50vw] w-[50vw] max-h-[550px] max-w-[550px] animate-[aurora-drift-2_26s_ease-in-out_infinite] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #171717) 25%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
    </div>
  );
}

// Bigger, richer, always-dark gradient blobs — the "premium immersive"
// opener, borrowed from the marketing landing page's AuroraHero.
function AuroraGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div
        className="absolute -top-1/3 -left-1/4 h-[60vw] w-[60vw] max-h-[650px] max-w-[650px] animate-[aurora-drift-1_20s_ease-in-out_infinite] rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #ffffff) 55%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[55vw] w-[55vw] max-h-[600px] max-w-[600px] animate-[aurora-drift-2_24s_ease-in-out_infinite] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #ffffff) 35%, white 15%) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 h-[35vw] w-[35vw] max-h-[420px] max-w-[420px] -translate-x-1/2 animate-[aurora-pulse_16s_ease-in-out_infinite] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #ffffff) 30%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// A single soft beam from the top plus a faint dot grid, vignetted at the
// edges — minimal, editorial, "spotlight on the craft" feel.
function SpotlightGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      <div
        className="absolute left-1/2 top-0 h-[70vh] w-[90vw] max-w-[900px] -translate-x-1/2 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in srgb, var(--site-accent, #ffffff) 45%, transparent) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
    </div>
  );
}

// Drifting particles on a dark backdrop, same tsparticles setup as the
// marketing landing page's hero — reserved for templates that want a
// glamorous, glittering first impression.
function SparklesGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 h-full w-full">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.5}
          maxSize={1.3}
          particleDensity={90}
          className="h-full w-full"
          particleColor="#ffffff"
          speed={1}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)" }}
      />
    </div>
  );
}

// A true CSS 3D perspective floor (rotateX'd grid plane scrolling toward the
// viewer) with a glow on the horizon — a technical, "performance lab" feel,
// visually unrelated to the blur/particle family above.
function Grid3DGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-x-0 top-0 h-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--site-accent, #ffffff) 40%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden"
        style={{ perspective: "500px", perspectiveOrigin: "50% 100%" }}
      >
        <div
          className="absolute inset-x-[-50%] bottom-0 h-[400%] animate-[grid-scroll_2s_linear_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--site-accent, #ffffff) 70%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--site-accent, #ffffff) 70%, transparent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            transform: "rotateX(60deg)",
            transformOrigin: "50% 100%",
          }}
        />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-1/4"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />
    </div>
  );
}

// Rotating conic-gradient light beams sweeping out of a vanishing point —
// speed and motion, distinct from the soft radial glows used elsewhere.
function BeamsGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div
        className="absolute left-1/2 top-1/2 h-[220vh] w-[220vh] animate-[beams-rotate_24s_linear_infinite] opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--site-accent, #ffffff) 65%, transparent) 6deg, transparent 16deg, transparent 175deg, color-mix(in srgb, var(--site-accent, #ffffff) 55%, transparent) 183deg, transparent 195deg, transparent 360deg)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 15%, black 80%)" }}
      />
    </div>
  );
}

// Four offset, differently-tinted blobs (one white-warmed) instead of the
// usual two — a denser, more "painterly" mesh gradient.
function MeshGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div
        className="absolute -top-1/4 left-[10%] h-[46vw] w-[46vw] max-h-[520px] max-w-[520px] animate-[aurora-drift-1_18s_ease-in-out_infinite] rounded-full opacity-60 blur-3xl"
        style={{ background: "color-mix(in srgb, var(--site-accent, #ffffff) 55%, transparent)" }}
      />
      <div
        className="absolute top-[15%] -right-1/4 h-[40vw] w-[40vw] max-h-[460px] max-w-[460px] animate-[aurora-drift-2_22s_ease-in-out_infinite] rounded-full opacity-55 blur-3xl"
        style={{ background: "color-mix(in srgb, var(--site-accent, #ffffff) 35%, white 25%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[28%] h-[38vw] w-[38vw] max-h-[420px] max-w-[420px] animate-[aurora-pulse_14s_ease-in-out_infinite] rounded-full opacity-45 blur-3xl"
        style={{ background: "color-mix(in srgb, var(--site-accent, #ffffff) 25%, transparent)" }}
      />
      <div
        className="absolute top-[38%] left-[55%] h-[30vw] w-[30vw] max-h-[340px] max-w-[340px] animate-[aurora-drift-1_26s_ease-in-out_infinite_reverse] rounded-full opacity-40 blur-3xl"
        style={{ background: "color-mix(in srgb, white 55%, var(--site-accent, #ffffff) 25%)" }}
      />
    </div>
  );
}

// Fixed (non-random, so server/client markup always matches) positions for
// the rising dots shared by BokehGlow and EmbersGlow — only size/count/blur
// differ between the two.
const floatingDots = [
  { left: "5%", size: 1, duration: 9, delay: 0 },
  { left: "14%", size: 0.6, duration: 7, delay: 1.2 },
  { left: "24%", size: 1.4, duration: 11, delay: 2.4 },
  { left: "34%", size: 0.8, duration: 8, delay: 0.6 },
  { left: "45%", size: 1.2, duration: 10, delay: 3.1 },
  { left: "56%", size: 0.7, duration: 7.5, delay: 1.8 },
  { left: "67%", size: 1.6, duration: 12, delay: 0.3 },
  { left: "78%", size: 0.9, duration: 9.5, delay: 2.7 },
  { left: "88%", size: 1.1, duration: 8.5, delay: 1.5 },
  { left: "95%", size: 0.5, duration: 6.5, delay: 3.6 },
  { left: "38%", size: 0.6, duration: 7.2, delay: 4.2 },
  { left: "72%", size: 1.3, duration: 10.5, delay: 0.9 },
];

function FloatingDots({
  count,
  baseSize,
  blurPx,
  opacity,
  color,
}: {
  count: number;
  baseSize: number;
  blurPx: number;
  opacity: number;
  color: string;
}) {
  return (
    <>
      {floatingDots.slice(0, count).map((dot, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: dot.left,
            width: dot.size * baseSize,
            height: dot.size * baseSize,
            background: color,
            filter: blurPx ? `blur(${blurPx}px)` : undefined,
            animationName: "float-rise",
            animationTimingFunction: "ease-in",
            animationIterationCount: "infinite",
            animationDuration: `${dot.duration}s`,
            animationDelay: `${dot.delay}s`,
            ["--float-opacity" as string]: opacity,
          }}
        />
      ))}
    </>
  );
}

// Large, soft, slow-drifting light circles — a camera-bokeh feel, fitting
// for anything visual/artistic.
function BokehGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--site-accent, #ffffff) 20%, transparent) 0%, transparent 65%)",
        }}
      />
      <FloatingDots
        count={7}
        baseSize={70}
        blurPx={10}
        opacity={0.4}
        color="color-mix(in srgb, var(--site-accent, #ffffff) 70%, transparent)"
      />
    </div>
  );
}

// Small, warm, quicker-rising dots — like embers over a hearth or a bar top.
function EmbersGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--site-accent, #ffffff) 30%, transparent) 0%, transparent 70%)",
        }}
      />
      <FloatingDots
        count={12}
        baseSize={5}
        blurPx={0}
        opacity={0.8}
        color="color-mix(in srgb, var(--site-accent, #ffffff) 80%, #ffb347 20%)"
      />
    </div>
  );
}

// A real WebGL photo scroller (same engine as GalleryBlock's "gallery3d")
// as the hero backdrop itself — photos drift and curve in 3D space behind
// the headline, with a dark vignette so the text stays legible. The
// heaviest option on purpose: reserved for heroes built to say "look at
// the work", not just "look at a nice color".
function PhotoGallery3DGlow({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <InfiniteGallery
        images={images.map((img) => ({ src: img.url, alt: img.alt }))}
        speed={1}
        visibleCount={Math.min(Math.max(images.length * 2, 6), 12)}
        className="h-full w-full"
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)" }}
      />
    </div>
  );
}

// Editorial hero — the premium look, and the only variant that changes the
// hero's *structure* rather than its backdrop.
//
// Every other variant is the same centred stack (headline, subheadline,
// button) over a different background, which is why they read as one
// template recoloured. This one splits the screen: a deep panel carrying
// the type, a full-height photograph beside it. Two consequences worth the
// choice — the type sits on solid ink instead of competing with a busy
// image, and the layout is the one luxury houses actually use.
//
// Restraint carries it: the accent is spent once, as a hairline rule, and
// the CTA is an underlined caps link rather than a filled button.
//
// Uses the existing backgroundImage field, so no schema change is needed
// and the client swaps in a photo of their own room from the editor.
function EditorialFrame({
  content,
  hasBackgroundImage,
}: {
  content: HeroContent;
  hasBackgroundImage: boolean;
}) {
  return (
    <section className="relative isolate grid w-full grid-cols-1 overflow-hidden bg-[#0c0b0a] lg:min-h-[88vh] lg:grid-cols-[1fr_1.05fr]">
      {/* Photo first on small screens: the room sells before the words do. */}
      {hasBackgroundImage && content.backgroundImage?.url && (
        <div
          className="order-1 h-56 w-full bg-cover bg-center sm:h-72 lg:order-2 lg:h-full"
          style={{ backgroundImage: `url(${content.backgroundImage.url})` }}
          role="img"
          aria-label={content.backgroundImage.alt || ""}
        />
      )}

      <div className="order-2 flex flex-col justify-center gap-7 px-6 py-16 sm:px-12 sm:py-20 lg:order-1 lg:px-16 lg:py-24">
        <span
          className="h-px w-14"
          style={{ background: "var(--site-accent, #ffffff)" }}
          aria-hidden
        />

        <h1
          className="animate-fade-up max-w-xl text-4xl leading-[1.08] font-light tracking-tight text-white text-balance sm:text-5xl lg:text-[3.4rem]"
          style={{ fontFamily: "var(--font-display-serif), Georgia, serif" }}
        >
          {content.headline}
        </h1>

        {content.subheadline && (
          <p
            className="animate-fade-up max-w-sm text-[0.95rem] leading-relaxed text-white/60"
            style={{ animationDelay: "0.1s" }}
          >
            {content.subheadline}
          </p>
        )}

        {content.ctaLabel && (
          <a
            href={content.ctaLink?.href ?? "#contact"}
            className="animate-fade-up mt-1 w-fit border-b border-white/30 pb-1.5 text-[0.7rem] tracking-[0.22em] text-white uppercase transition-colors hover:border-white"
            style={{ animationDelay: "0.2s" }}
          >
            {content.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}

// Outdoor coaching: layered ridgelines drifting at different speeds over a
// dawn sky. The depth is parallax — nearer ridges move faster — which is
// also why it costs nothing: three SVG shapes, no shader, no canvas.
function RidgeGlow() {
  const ridges = [
    { d: "M0,120 C120,70 220,140 360,100 C500,60 620,130 760,95 L760,220 L0,220 Z", speed: "70s", opacity: 0.28, y: "38%" },
    { d: "M0,140 C140,95 240,165 380,125 C520,85 640,155 760,120 L760,220 L0,220 Z", speed: "48s", opacity: 0.45, y: "52%" },
    { d: "M0,160 C110,125 250,185 390,150 C530,115 650,180 760,145 L760,220 L0,220 Z", speed: "32s", opacity: 0.7, y: "66%" },
  ];
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#f2f5ec]">
      {/* dawn wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #fdfbf3 0%, color-mix(in srgb, var(--site-accent, #4D7C0F) 10%, #fdfbf3) 45%, color-mix(in srgb, var(--site-accent, #4D7C0F) 22%, #f2f5ec) 100%)",
        }}
      />
      {ridges.map((r, i) => (
        <div
          key={i}
          className="animate-ridge-drift absolute inset-x-0"
          style={{
            top: r.y,
            height: "62%",
            width: "200%",
            ["--ridge-speed" as string]: r.speed,
            opacity: r.opacity,
          } as CSSProperties}
        >
          {/* duplicated side by side so translateX(-50%) loops seamlessly */}
          <svg viewBox="0 0 1520 220" preserveAspectRatio="none" className="h-full w-full">
            <path d={r.d} fill="var(--site-accent, #4D7C0F)" />
            <path d={r.d} transform="translate(760,0)" fill="var(--site-accent, #4D7C0F)" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// Performance lab: a trace drawing itself across a measurement grid, with a
// scan passing over it. Reads as telemetry rather than as decoration, which
// is the claim this template makes.
function TelemetryGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#070809]">
      {/* measurement grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1c2024 1px, transparent 1px), linear-gradient(to bottom, #1c2024 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%)",
        }}
      />
      {/* the trace */}
      <svg
        viewBox="0 0 1400 300"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[18%] h-[42%] w-full"
        aria-hidden
      >
        <path
          d="M0,240 L180,238 L240,150 L300,246 L420,244 L470,96 L520,250 L660,246 L720,168 L780,250 L940,247 L1000,60 L1060,252 L1200,248 L1260,176 L1320,250 L1400,248"
          fill="none"
          stroke="var(--site-accent, #EA580C)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeDasharray="1400"
          className="animate-trace-sweep"
        />
      </svg>
      {/* scan sweep */}
      <div
        className="animate-trace-scan absolute inset-y-0 w-[14%]"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in srgb, var(--site-accent, #EA580C) 40%, transparent), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(7,8,9,0.8) 100%)" }}
      />
    </div>
  );
}

// Training photographs rushing out of the vanishing point. Answers the two
// things a coach's opener has to do at once — show people actually training,
// and move — without another WebGL context: this is CSS 3D.
//
// Distinct from photoGallery3d, which scrolls a flat wall of pictures
// sideways; here the corridor comes at the viewer, which is the register
// sport wants.
function StreamGlow({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <ImageStreamHero
        images={images.map((i) => ({ src: i.url, alt: i.alt }))}
        speed={22}
        cards={9}
        className="h-full w-full"
      />
      {/* the corridor is busiest at the edges, so clear the middle for type */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 46% at 50% 48%, rgba(10,10,10,0.9) 35%, rgba(10,10,10,0.35) 100%)",
        }}
      />
    </div>
  );
}

// Barbershop: the pole itself, turning in a dark room, pushed to the right
// so the headline keeps the left. An object rather than an effect — the
// abstract variants all read as "a shader", which told a visitor nothing
// about the trade.
function BarberPoleGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0807]">
      {/* warm pool behind the pole so it sits in a room, not in the void */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 80% 52%, color-mix(in srgb, var(--site-accent, #B45309) 22%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Sized by the wrapper, not absolutely positioned itself: react-three
          -fiber measures its host at mount, and an `absolute inset-0` host
          reports 0 before layout settles, leaving the canvas stuck at its
          300x150 default. */}
      <BarberPole className="h-full w-full" />
      {/* darkens the left so the headline always has ground to sit on */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,8,7,0.95) 0%, rgba(10,8,7,0.7) 40%, rgba(10,8,7,0) 78%)",
        }}
      />
    </div>
  );
}

// Daylight through a salon window: soft blush shafts over warm off-white.
// Light-mode, so it stays out of immersiveVariants and the hero text keeps
// its dark colour — the "clair et souriant" read for a women's salon.
function SunbeamGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#fdf9f7]">
      <GodRays
        className="h-full w-full"
        // near-white ground -> blush -> warm rose -> near-white light
        colors={[
          [0.992, 0.976, 0.969],
          [0.965, 0.882, 0.886],
          [0.925, 0.702, 0.749],
          [1.0, 0.988, 0.976],
        ]}
        intensity={0.22}
        paramA={0.5}
        scale={1.05}
        contrast={0.94}
        saturation={0.9}
        grain={0.018}
        timeScale={0.32}
        seed={4}
      />
      {/* keeps the dark headline legible over the brightest shafts */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(253,249,247,0.82) 20%, rgba(253,249,247,0.25) 100%)" }}
      />
    </div>
  );
}

// The same engine at the other end of the dial: a single warm shaft cutting
// deep shadow, rotated off-axis and slower, so it reads as a lit barbershop
// rather than the salon's daylight.
function HaloGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#080605]">
      <GodRays
        className="h-full w-full"
        // near-black -> deep brown -> copper -> warm gold
        colors={[
          [0.031, 0.024, 0.020],
          [0.180, 0.098, 0.055],
          [0.706, 0.325, 0.035],
          [0.976, 0.784, 0.463],
        ]}
        intensity={0.42}
        paramA={0.2}
        scale={1.35}
        rotate={0.42}
        contrast={1.08}
        vignette={0.55}
        grain={0.05}
        timeScale={0.22}
        seed={9}
      />
    </div>
  );
}

// Barbershop lounge: one warm pool of light breathing over near-black, with
// a fine grain so the gradient reads as a lit room rather than a CSS blur.
// Pure CSS on purpose — only the flagship carries the WebGL silk, so a page
// listing every template doesn't spin up a canvas per card.
function VelvetGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0b0908]">
      <div
        className="absolute left-1/2 top-1/2 h-[120vh] w-[120vh] animate-[velvet-breathe_14s_ease-in-out_infinite] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #ffffff) 55%, transparent) 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)" }}
      />
    </div>
  );
}

// The light-mode counterpart: a pale ground, a whisper of woven texture, and
// two wide washes drifting at different speeds. Deliberately almost still —
// the restraint is the point for a salon that sells calm.
function LinenGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#f6f5f2]">
      <div
        className="absolute -left-1/4 top-[-20%] h-[90vh] w-[90vh] animate-[linen-wash-1_22s_ease-in-out_infinite] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #999999) 38%, transparent) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute -right-1/4 bottom-[-25%] h-[80vh] w-[80vh] animate-[linen-wash-2_28s_ease-in-out_infinite] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #999999) 22%, #ffffff 30%) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(120,120,110,0.05) 0 1px, transparent 1px 4px), repeating-linear-gradient(0deg, rgba(120,120,110,0.05) 0 1px, transparent 1px 4px)",
        }}
      />
    </div>
  );
}

// Full-bleed silk weave; the shader reads --site-accent itself, so the
// same variant suits a gold salon and a plum one without extra config.
function SilkGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <SilkBackground className="h-full w-full" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.55) 100%)" }}
      />
    </div>
  );
}

// The title band of an interior page. Deliberately quiet: on a multi-page
// site the home hero is the one that gets to be spectacular, and repeating
// that treatment on every page cheapens all of them. A hairline accent rule,
// the title, one line of context — and the content starts immediately.
function PageHeaderHero({
  content,
  hasBackgroundImage,
}: {
  content: HeroContent;
  hasBackgroundImage: boolean;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden px-6 ${
        hasBackgroundImage
          ? "py-24 sm:py-32"
          : "border-b border-neutral-200/70 py-16 sm:py-20 dark:border-white/10"
      }`}
      style={
        hasBackgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.backgroundImage!.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl">
        <span
          className="animate-fade-up block h-px w-12"
          style={{ backgroundColor: "var(--site-accent, #171717)" }}
        />
        <h1
          className={`animate-fade-up mt-6 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl ${
            hasBackgroundImage ? "text-white" : "text-neutral-900 dark:text-white"
          }`}
        >
          {content.headline}
        </h1>
        {content.subheadline && (
          <p
            className={`animate-fade-up mt-4 max-w-xl text-base ${
              hasBackgroundImage ? "text-white/85" : "text-neutral-600 dark:text-neutral-400"
            }`}
            style={{ animationDelay: "0.1s" }}
          >
            {content.subheadline}
          </p>
        )}
        {content.ctaLabel && (
          <a
            href={content.ctaLink?.href ?? "#contact"}
            className="animate-fade-up mt-7 inline-block rounded-md px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--site-accent, #171717)", animationDelay: "0.2s" }}
          >
            {content.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}

const immersiveVariants = new Set([
  "sparkles",
  "aurora",
  "spotlight",
  "grid3d",
  "beams",
  "mesh",
  "bokeh",
  "embers",
  "photoGallery3d",
  "silk",
  "velvet",
  "halo",
  "barberPole",
  "stream",
  "telemetry",
]);

export function HeroBlock({ content }: { content: HeroContent }) {
  const hasBackgroundImage = !!content.backgroundImage?.url;
  const hasHeroImages = (content.heroImages?.length ?? 0) > 0;
  const requestedVariant = content.heroVariant ?? "blobs";

  // Checked before the coercion below: that rule turns any image-backed hero
  // into "blobs", but editorial owns its whole layout and *wants* the photo.
  if (requestedVariant === "editorial") {
    return <EditorialFrame content={content} hasBackgroundImage={hasBackgroundImage} />;
  }

  // Same reason as editorial: it owns its layout and keeps its photo.
  if (requestedVariant === "pageHeader") {
    return <PageHeaderHero content={content} hasBackgroundImage={hasBackgroundImage} />;
  }

  if (requestedVariant === "programRail") {
    return (
      <PulseFitHero
        title={content.headline}
        subtitle={content.subheadline}
        primaryAction={
          content.ctaLabel
            ? { label: content.ctaLabel, href: content.ctaLink?.href ?? "#contact" }
            : undefined
        }
        programs={content.heroCards}
        backgroundImage={content.backgroundImage}
      />
    );
  }

  const variant = hasBackgroundImage
    ? "blobs"
    : (requestedVariant === "photoGallery3d" || requestedVariant === "stream") &&
        !hasHeroImages
      ? "blobs"
      : requestedVariant;
  const isImmersive = immersiveVariants.has(variant);

  return (
    <section
      className={`relative isolate flex flex-col items-center justify-center gap-6 overflow-hidden px-6 py-28 text-center ${
        isImmersive ? "min-h-[70vh]" : ""
      }`}
      style={
        hasBackgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${content.backgroundImage!.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!hasBackgroundImage && variant === "blobs" && <HeroBlobs />}
      {!hasBackgroundImage && variant === "aurora" && <AuroraGlow />}
      {!hasBackgroundImage && variant === "spotlight" && <SpotlightGlow />}
      {!hasBackgroundImage && variant === "sparkles" && <SparklesGlow />}
      {!hasBackgroundImage && variant === "grid3d" && <Grid3DGlow />}
      {!hasBackgroundImage && variant === "beams" && <BeamsGlow />}
      {!hasBackgroundImage && variant === "mesh" && <MeshGlow />}
      {!hasBackgroundImage && variant === "bokeh" && <BokehGlow />}
      {!hasBackgroundImage && variant === "embers" && <EmbersGlow />}
      {!hasBackgroundImage && variant === "sunbeam" && <SunbeamGlow />}
      {!hasBackgroundImage && variant === "ridges" && <RidgeGlow />}
      {!hasBackgroundImage && variant === "telemetry" && <TelemetryGlow />}
      {!hasBackgroundImage && variant === "stream" && hasHeroImages && (
        <StreamGlow images={content.heroImages!} />
      )}
      {!hasBackgroundImage && variant === "barberPole" && <BarberPoleGlow />}
      {!hasBackgroundImage && variant === "halo" && <HaloGlow />}
      {!hasBackgroundImage && variant === "velvet" && <VelvetGlow />}
      {!hasBackgroundImage && variant === "linen" && <LinenGlow />}
      {!hasBackgroundImage && variant === "silk" && <SilkGlow />}
      {!hasBackgroundImage && variant === "photoGallery3d" && hasHeroImages && (
        <PhotoGallery3DGlow images={content.heroImages!} />
      )}
      <h1
        className={`animate-fade-up relative z-10 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl ${
          hasBackgroundImage || isImmersive ? "text-white" : "text-neutral-900 dark:text-white"
        }`}
      >
        {content.headline}
      </h1>
      {content.subheadline && (
        <p
          className={`animate-fade-up relative z-10 max-w-xl text-lg ${
            hasBackgroundImage || isImmersive ? "text-white/90" : "text-neutral-600 dark:text-neutral-400"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          {content.subheadline}
        </p>
      )}
      {content.ctaLabel && (
        <a
          href={content.ctaLink?.href ?? "#contact"}
          className="animate-fade-up relative z-10 rounded-md px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition-transform hover:scale-105"
          style={{ backgroundColor: "var(--site-accent, #171717)", animationDelay: "0.2s" }}
        >
          {content.ctaLabel}
        </a>
      )}
    </section>
  );
}
