import { GodRays } from "@/components/ui/god-rays";

export default function SunbeamGlow() {
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
