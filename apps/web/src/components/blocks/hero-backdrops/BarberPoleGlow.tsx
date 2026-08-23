import { BarberPole } from "@/components/ui/barber-pole";

export default function BarberPoleGlow() {
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
