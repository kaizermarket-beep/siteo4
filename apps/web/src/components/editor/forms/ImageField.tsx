"use client";

import { useRef, useState } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { inputClass } from "./shared";

const MAX_SIZE_MB = 5;

export function ImageField<T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const url = typeof field.value === "string" ? field.value : "";

        async function handleFile(file: File) {
          if (!file.type.startsWith("image/")) {
            setError("Formats acceptés : JPG, PNG, WEBP, GIF.");
            return;
          }
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`Image trop lourde (max ${MAX_SIZE_MB} Mo).`);
            return;
          }
          setError(null);
          setUploading(true);
          try {
            const body = new FormData();
            body.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
              throw new Error(data?.error ?? "Échec de l'envoi.");
            }
            field.onChange(data.url as string);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Échec de l'envoi.");
          } finally {
            setUploading(false);
          }
        }

        return (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-700">{label}</span>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-neutral-400">Aucune</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) handleFile(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="self-start rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
                >
                  {uploading ? "Envoi…" : url ? "Changer l'image" : "Choisir une image"}
                </button>
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
            </div>
            <input
              value={url}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="ou collez une URL d'image"
              className={`${inputClass} text-xs`}
            />
          </div>
        );
      }}
    />
  );
}
