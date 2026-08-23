import { GodRays } from "@/components/ui/god-rays";

export default function HaloGlow() {
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
