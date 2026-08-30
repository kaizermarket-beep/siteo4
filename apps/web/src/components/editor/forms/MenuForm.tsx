"use client";

import { useForm, useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { menuContentSchema, type MenuContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

type MenuFormValues = z.input<typeof menuContentSchema>;

function CategoryItems({
  control,
  register,
  categoryIndex,
}: {
  control: Control<MenuFormValues>;
  register: UseFormRegister<MenuFormValues>;
  categoryIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.items`,
  });

  return (
    <div className="flex flex-col gap-2 border-l border-neutral-200 pl-3">
      {fields.map((field, itemIndex) => (
        <div key={field.id} className="flex flex-col gap-1 rounded border border-neutral-200 p-2">
          <input
            {...register(`categories.${categoryIndex}.items.${itemIndex}.name`)}
            placeholder="Nom du plat"
            className={inputClass}
          />
          <textarea
            {...register(`categories.${categoryIndex}.items.${itemIndex}.description`)}
            placeholder="Description"
            rows={2}
            className={inputClass}
          />
          <input
            {...register(`categories.${categoryIndex}.items.${itemIndex}.price`)}
            placeholder="Prix (ex : 18€)"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(itemIndex)}
            disabled={fields.length <= 1}
            className="self-start text-xs text-red-600 disabled:opacity-40"
          >
            Supprimer le plat
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ name: "", description: "", price: "" })}
        disabled={fields.length >= 12}
        className="self-start text-xs text-neutral-700 underline disabled:opacity-40"
      >
        + Ajouter un plat
      </button>
    </div>
  );
}

export function MenuForm({ blockId, defaultValues }: { blockId: string; defaultValues: MenuContent }) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<MenuFormValues>({
    resolver: zodResolver(menuContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "categories" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, menuContentSchema.parse(v));
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

      <Field label="Affichage">
        <select {...register("layout")} className={inputClass}>
          <option value="list">Tout à la suite</option>
          <option value="tabs">Onglets (une carte à la fois)</option>
        </select>
      </Field>

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-neutral-700">Catégories</span>
        {fields.map((field, categoryIndex) => (
          <div key={field.id} className="flex flex-col gap-2 rounded-md border border-neutral-200 p-3">
            <div className="flex items-center gap-2">
              <input
                {...register(`categories.${categoryIndex}.name`)}
                placeholder="Nom de la catégorie (ex : Entrées)"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => remove(categoryIndex)}
                disabled={fields.length <= 1}
                className="text-xs text-red-600 disabled:opacity-40"
              >
                Supprimer
              </button>
            </div>
            <CategoryItems control={control} register={register} categoryIndex={categoryIndex} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ name: "", items: [{ name: "", description: "", price: "" }] })}
          disabled={fields.length >= 6}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" {...register("orderEnabled")} />
        Activer la commande via WhatsApp
      </label>
      <Field label="Numéro WhatsApp">
        <input {...register("orderPhone")} placeholder="06 12 34 56 78" className={inputClass} />
      </Field>

      <SaveIndicator status={status} />
    </div>
  );
}
