"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { footerContentSchema, type FooterContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

export function FooterForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: FooterContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<FooterContent>({
    resolver: zodResolver(footerContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "links" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, footerContentSchema.parse(v));
    },
    800,
    (v) => setBlockContent(blockId, v)
  );

  return (
    <div className="flex flex-col gap-4">
      <Field label="Texte">
        <input {...register("text")} className={inputClass} />
      </Field>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`links.${index}.label`)}
              placeholder="Libellé"
              className={`${inputClass} flex-1`}
            />
            <input
              {...register(`links.${index}.href`)}
              placeholder="Lien"
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={() => remove(index)} className="text-xs text-red-600">
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ label: "", href: "" })}
          disabled={fields.length >= 6}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter un lien
        </button>
      </div>

      <SaveIndicator status={status} />
    </div>
  );
}
