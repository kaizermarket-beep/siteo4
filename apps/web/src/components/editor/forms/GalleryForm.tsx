"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { galleryContentSchema, type GalleryContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

export function GalleryForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: GalleryContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<GalleryContent>({
    resolver: zodResolver(galleryContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "images" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, galleryContentSchema.parse(v));
    },
    800,
    (v) => setBlockContent(blockId, v)
  );

  return (
    <div className="flex flex-col gap-4">
      <Field label="Titre">
        <input {...register("title")} className={inputClass} />
      </Field>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2 rounded-md border border-neutral-200 p-3">
            <input
              {...register(`images.${index}.image.url`)}
              placeholder="URL de l'image"
              className={inputClass}
            />
            <input
              {...register(`images.${index}.image.alt`)}
              placeholder="Texte alternatif"
              className={inputClass}
            />
            <input
              {...register(`images.${index}.caption`)}
              placeholder="Légende"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              className="self-start text-xs text-red-600 disabled:opacity-40"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ image: { url: "", alt: "" }, caption: "" })}
          disabled={fields.length >= 12}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter une image
        </button>
      </div>

      <SaveIndicator status={status} />
    </div>
  );
}
