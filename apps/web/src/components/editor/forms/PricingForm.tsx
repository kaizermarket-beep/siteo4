"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { pricingContentSchema, type PricingContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

type PricingFormValues = z.input<typeof pricingContentSchema>;

export function PricingForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: PricingContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "plans" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, pricingContentSchema.parse(v));
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
                {...register(`plans.${index}.name`)}
                placeholder="Nom"
                className={`${inputClass} flex-1`}
              />
              <input
                {...register(`plans.${index}.price`)}
                placeholder="Prix"
                className={`${inputClass} w-24`}
              />
              <input
                {...register(`plans.${index}.period`)}
                placeholder="/mois"
                className={`${inputClass} w-20`}
              />
            </div>
            <Controller
              control={control}
              name={`plans.${index}.features`}
              render={({ field: f }) => (
                <textarea
                  defaultValue={f.value?.join("\n") ?? ""}
                  onChange={(e) => f.onChange(e.target.value.split("\n").filter(Boolean))}
                  placeholder={"Une caractéristique par ligne"}
                  rows={3}
                  className={inputClass}
                />
              )}
            />
            <div className="flex items-center gap-4">
              <input
                {...register(`plans.${index}.ctaLabel`)}
                placeholder="Texte du bouton"
                className={`${inputClass} flex-1`}
              />
              <label className="flex items-center gap-1 text-xs text-neutral-600">
                <input type="checkbox" {...register(`plans.${index}.highlighted`)} />
                Mise en avant
              </label>
            </div>
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
            append({ name: "", price: "", period: "", features: [], ctaLabel: "Choisir", highlighted: false })
          }
          disabled={fields.length >= 4}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter une offre
        </button>
      </div>

      <SaveIndicator status={status} />
    </div>
  );
}
