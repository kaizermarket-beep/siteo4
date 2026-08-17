"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { contactContentSchema, type ContactContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

type ContactFormValues = z.input<typeof contactContentSchema>;

export function ContactForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: ContactContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<ContactFormValues>({
    resolver: zodResolver(contactContentSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, contactContentSchema.parse(v));
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
      <Field label="Email">
        <input {...register("email")} className={inputClass} />
      </Field>
      <Field label="Téléphone">
        <input {...register("phone")} className={inputClass} placeholder="06 12 34 56 78" />
      </Field>
      <Field label="Adresse">
        <input {...register("address")} className={inputClass} placeholder="12 rue de la Paix, 75002 Paris" />
      </Field>
      <Field label="Horaires">
        <textarea
          {...register("hours")}
          rows={3}
          className={inputClass}
          placeholder={"Lun-Ven : 9h-19h\nSam : 9h-17h"}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-neutral-700">Réseaux sociaux</span>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`socialLinks.${index}.platform`)}
              placeholder="Instagram"
              className={`${inputClass} w-32`}
            />
            <input
              {...register(`socialLinks.${index}.href`)}
              placeholder="https://instagram.com/..."
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={() => remove(index)} className="text-xs text-red-600">
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ platform: "", href: "" })}
          disabled={fields.length >= 5}
          className="self-start text-sm text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter un réseau
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" {...register("showForm")} />
        Afficher le formulaire de contact
      </label>
      <SaveIndicator status={status} />
    </div>
  );
}
