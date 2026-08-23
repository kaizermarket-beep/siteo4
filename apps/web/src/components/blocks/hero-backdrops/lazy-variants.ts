// Plain module on purpose — no "use client".
//
// This set used to live in HeroBackdrop.tsx, which is a Client Component.
// Across the server/client boundary React only proxies components and
// functions: a data export like a Set arrives on the server as a client
// reference, not as the value. HeroBlock then called `.has()` on a proxy and
// every hero on every published site rendered "Une erreur est survenue".
//
// Both sides import it from here, so the list and the dispatch in
// HeroBackdrop.tsx cannot drift apart.
export const lazyBackdropVariants = new Set([
  "sparkles",
  "photoGallery3d",
  "stream",
  "barberPole",
  "sunbeam",
  "halo",
  "silk",
]);
