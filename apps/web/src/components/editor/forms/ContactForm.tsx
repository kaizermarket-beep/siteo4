"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactContentSchema, type ContactContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

export function ContactForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: ContactContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, watch } = useForm<ContactContent>({
    resolver: zodResolver(contactContentSchema),
    defaultValues,
  });
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
      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" {...register("showForm")} />
        Afficher le formulaire de contact
      </label>
      <SaveIndicator status={status} />
    </div>
  );
}
