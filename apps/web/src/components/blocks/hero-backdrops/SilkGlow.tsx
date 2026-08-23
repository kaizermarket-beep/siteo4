import { SilkBackground } from "@/components/ui/silk-background";

export default function SilkGlow() {
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
