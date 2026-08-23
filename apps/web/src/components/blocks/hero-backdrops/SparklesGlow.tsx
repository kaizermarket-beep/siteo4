import { SparklesCore } from "@/components/ui/sparkles";

export default function SparklesGlow() {
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
