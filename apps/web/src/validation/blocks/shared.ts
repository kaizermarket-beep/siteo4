import { z } from "zod";

// href/label/url are allowed empty: optional link/image fields are stored as
// {href:"",label:""} / {url:"",alt:""} by the editor forms (so react-hook-form
// always has a controlled object to bind to) rather than as `undefined`, and
// block components treat an empty string as "not set" when rendering.
export const linkSchema = z.object({
  href: z.string().max(2048).default(""),
  label: z.string().max(40).default(""),
});

export const imageSchema = z.object({
  url: z.string().max(2048).default(""),
  alt: z.string().max(160).default(""),
});
