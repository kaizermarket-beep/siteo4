"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { featuresContentSchema, type FeaturesContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

export function FeaturesForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: FeaturesContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<FeaturesContent>({
    resolver: zodResolver(featuresContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, featuresContentSchema.parse(v));
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
            <div className="flex gap-2">
              <input
                {...register(`items.${index}.icon`)}
                placeholder="Icône"
                className={`${inputClass} w-16`}
              />
              <input
                {...register(`items.${index}.title`)}
                placeholder="Titre"
                className={`${inputClass} flex-1`}
              />
            </div>
            <textarea
              {...register(`items.${index}.description`)}
              placeholder="Description"
              rows={2}
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
          onClick={() => append({ icon: "✦", title: "", description: "" })}
          disabled={fields.length >= 6}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter un élément
        </button>
      </div>

      <SaveIndicator status={status} />
    </div>
  );
}
