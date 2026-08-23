Backdrops that pull in a client-side library (three.js, tsparticles, WebGL
shaders). They live in their own modules so `HeroBackdrop.tsx` can load them
with `next/dynamic`.

Before this split, `HeroBlock.tsx` imported all of them statically. Every
published site therefore shipped the union of every variant's dependencies:
a Salon Prestige site, whose hero is a photograph and some text, downloaded
910 kB of three.js and 171 kB of tsparticles it never used.

The dynamic imports have to sit in a Client Component. Next's own docs are
explicit: "When a Server Component dynamically imports a Client Component,
automatic code splitting is currently not supported." HeroBlock is a Server
Component, so calling `dynamic()` there would have split nothing.

Purely CSS backdrops stay in HeroBlock.tsx — they cost nothing to ship.
