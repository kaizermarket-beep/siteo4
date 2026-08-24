"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { reservationContentSchema, type ReservationContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

type ReservationFormValues = z.input<typeof reservationContentSchema>;

const WEEKDAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sam" },
  { value: 0, label: "Dim" },
];

export function ReservationForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: ReservationContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationContentSchema),
    defaultValues,
  });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, reservationContentSchema.parse(v));
    },
    800,
    (v) => setBlockContent(blockId, v)
  );

  // Numbers arrive from <input type="number"> as strings; valueAsNumber keeps
  // the Zod schema seeing a number instead of failing on "12".
  const numeric = { valueAsNumber: true } as const;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Titre">
        <input {...register("title")} className={inputClass} />
      </Field>
      <Field label="Description">
        <textarea {...register("description")} rows={2} className={inputClass} />
      </Field>

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Votre salle</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tables">
            <input type="number" min={1} {...register("tableCount", numeric)} className={inputClass} />
          </Field>
          <Field label="Couverts">
            <input type="number" min={1} {...register("seatCount", numeric)} className={inputClass} />
          </Field>
        </div>
        <p className="text-xs text-neutral-500">
          Une réservation occupe une table. Un créneau est complet quand il n&apos;y a plus de table
          libre <em>ou</em> plus assez de couverts.
        </p>
        <Field label="Personnes max par réservation">
          <input type="number" min={1} {...register("maxPartySize", numeric)} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Service</legend>

        <Controller
          control={control}
          name="openDays"
          render={({ field }) => {
            const selected: number[] = field.value ?? [];
            return (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-neutral-500">Jours d&apos;ouverture</span>
                <div className="flex flex-wrap gap-1">
                  {WEEKDAYS.map((day) => {
                    const on = selected.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            on
                              ? selected.filter((v) => v !== day.value)
                              : [...selected, day.value].sort()
                          )
                        }
                        className={`rounded-md border px-2.5 py-1 text-xs ${
                          on
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 text-neutral-600"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="slots"
          render={({ field }) => {
            const slots: string[] = field.value ?? [];
            return (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-neutral-500">Créneaux</span>
                <div className="flex flex-col gap-1.5">
                  {slots.map((slot, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="time"
                        value={slot}
                        onChange={(e) => {
                          const next = [...slots];
                          next[i] = e.target.value;
                          field.onChange(next);
                        }}
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange(slots.filter((_, j) => j !== i))}
                        aria-label={`Retirer le créneau ${slot}`}
                        className="px-2 text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => field.onChange([...slots, "19:00"])}
                  className="w-fit rounded-md border border-dashed border-neutral-300 px-2.5 py-1 text-xs text-neutral-500"
                >
                  + Créneau
                </button>
              </div>
            );
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Prévenance (h)">
            <input type="number" min={0} {...register("noticeHours", numeric)} className={inputClass} />
          </Field>
          <Field label="Horizon (jours)">
            <input type="number" min={1} {...register("maxDaysAhead", numeric)} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <Field label="Téléphone du restaurant">
        <input {...register("phone")} placeholder="01 23 45 67 89" className={inputClass} />
      </Field>

      <SaveIndicator status={status} />
    </div>
  );
}
