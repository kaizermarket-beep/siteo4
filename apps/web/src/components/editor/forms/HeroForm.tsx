"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { heroContentSchema, type HeroContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";
import { ImageField } from "./ImageField";

// react-hook-form is typed against the schema's *input* shape (fields with
// .default() are optional pre-parse) — the resolver parses up to the
// output shape (HeroContent) internally. Using the output type here trips
// a resolver type mismatch even though runtime behavior is correct.
type HeroFormValues = z.input<typeof heroContentSchema>;

export function HeroForm({ blockId, defaultValues }: { blockId: string; defaultValues: HeroContent }) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<HeroFormValues>({
    resolver: zodResolver(heroContentSchema),
    defaultValues: {
      ...defaultValues,
      ctaLink: defaultValues.ctaLink ?? { href: "", label: "" },
      backgroundImage: defaultValues.backgroundImage ?? { url: "", alt: "" },
    },
  });
  const badges = useFieldArray({ control, name: "heroBadges" });
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
      <ImageField control={control} name="backgroundImage.url" label="Image de fond" />

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Avis affichés</legend>
        <p className="text-xs text-neutral-500">
          Une note et sa source, cliquables. Visibles sur les en-têtes de type « éditorial ».
        </p>
        {badges.fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2 rounded border border-neutral-200 p-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                {...register(`heroBadges.${index}.value`)}
                placeholder="4,8"
                aria-label="Note"
                className={inputClass}
              />
              <input
                {...register(`heroBadges.${index}.label`)}
                placeholder="Google"
                aria-label="Source"
                className={inputClass}
              />
            </div>
            <input
              {...register(`heroBadges.${index}.href`)}
              placeholder="https://…"
              aria-label="Lien vers l'avis"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => badges.remove(index)}
              className="self-start text-xs text-red-600"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => badges.append({ value: "", label: "", href: "" })}
          disabled={badges.fields.length >= 4}
          className="self-start text-xs text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter un avis
        </button>
      </fieldset>

      <SaveIndicator status={status} />
    </div>
  );
}
