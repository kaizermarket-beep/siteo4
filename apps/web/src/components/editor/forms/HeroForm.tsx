"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroContentSchema, type HeroContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

export function HeroForm({ blockId, defaultValues }: { blockId: string; defaultValues: HeroContent }) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, watch } = useForm<HeroContent>({
    resolver: zodResolver(heroContentSchema),
    defaultValues: {
      ...defaultValues,
      ctaLink: defaultValues.ctaLink ?? { href: "", label: "" },
      backgroundImage: defaultValues.backgroundImage ?? { url: "", alt: "" },
    },
  });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, heroContentSchema.parse(v));
    },
    800,
    (v) => setBlockContent(blockId, v)
  );

  return (
    <div className="flex flex-col gap-4">
      <Field label="Titre">
        <input {...register("headline")} className={inputClass} />
      </Field>
      <Field label="Sous-titre">
        <textarea {...register("subheadline")} rows={3} className={inputClass} />
      </Field>
      <Field label="Texte du bouton">
        <input {...register("ctaLabel")} className={inputClass} />
      </Field>
      <Field label="Lien du bouton">
        <input {...register("ctaLink.href")} placeholder="#contact" className={inputClass} />
      </Field>
      <Field label="Image de fond (URL)">
        <input {...register("backgroundImage.url")} placeholder="https://…" className={inputClass} />
      </Field>
      <SaveIndicator status={status} />
    </div>
  );
}
