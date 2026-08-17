"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { beforeAfterContentSchema, type BeforeAfterContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";
import { ImageField } from "./ImageField";

type BeforeAfterFormValues = z.input<typeof beforeAfterContentSchema>;

export function BeforeAfterForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: BeforeAfterContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<BeforeAfterFormValues>({
    resolver: zodResolver(beforeAfterContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, beforeAfterContentSchema.parse(v));
    },
    800,
    (v) => setBlockContent(blockId, v)
  );

  return (
    <div className="flex flex-col gap-4">
      <Field label="Titre">
        <input {...register("title")} className={inputClass} />
      </Field>
      <Field label="Description">
        <textarea {...register("description")} rows={2} className={inputClass} />
      </Field>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2 rounded-md border border-neutral-200 p-3">
            <ImageField control={control} name={`items.${index}.beforeImage.url`} label="Photo avant" />
            <ImageField control={control} name={`items.${index}.afterImage.url`} label="Photo après" />
            <input
              {...register(`items.${index}.label`)}
              placeholder="Légende (ex : 3 mois de coaching)"
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
          onClick={() =>
            append({
              beforeImage: { url: "", alt: "Avant" },
              afterImage: { url: "", alt: "Après" },
              label: "",
            })
          }
          disabled={fields.length >= 6}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter une transformation
        </button>
      </div>

      <SaveIndicator status={status} />
    </div>
  );
}
