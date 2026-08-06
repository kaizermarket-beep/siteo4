"use client";

import { useActionState, useState } from "react";
import { createSite } from "@/server-actions/sites";
import { slugify } from "@/lib/slug";

type TemplateOption = {
  slug: string;
  name: string;
  description: string;
  isPremium: boolean;
};

export function NewSiteForm({ templates }: { templates: TemplateOption[] }) {
  const [state, formAction, pending] = useActionState(createSite, undefined);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium text-neutral-700">Choisissez un modèle</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {templates.map((template) => (
            <label
              key={template.slug}
              className={`cursor-pointer rounded-lg border p-4 text-sm transition ${
                selectedTemplate === template.slug
                  ? "border-neutral-900 ring-1 ring-neutral-900"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <input
                type="radio"
                name="templateSlug"
                value={template.slug}
                checked={selectedTemplate === template.slug}
                onChange={() => setSelectedTemplate(template.slug)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900">{template.name}</span>
                {template.isPremium && (
                  <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
                    Premium
                  </span>
                )}
              </div>
              <p className="mt-1 text-neutral-600">{template.description}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 sm:max-w-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">
            Nom du site
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="slug" className="text-sm font-medium text-neutral-700">
            Adresse
          </label>
          <div className="flex items-center rounded-md border border-neutral-300 text-sm">
            <input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
              className="min-w-0 flex-1 px-3 py-2 outline-none"
            />
            <span className="whitespace-nowrap px-3 py-2 text-neutral-500">.siteo.com</span>
          </div>
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Création…" : "Créer le site"}
        </button>
      </div>
    </form>
  );
}
