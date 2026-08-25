"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { appointmentContentSchema, type AppointmentContent } from "@/validation/blocks";
import { useAutosave } from "../use-autosave";
import { updateBlockContent } from "@/server-actions/blocks";
import { useEditorStore } from "../editor-context";
import { Field, inputClass, SaveIndicator } from "./shared";

type AppointmentFormValues = z.input<typeof appointmentContentSchema>;

type Range = { start: string; end: string };
type DayHours = { day: number; ranges: Range[] };

const WEEKDAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

// A closed day is simply absent from `hours`, so opening one means adding an
// entry and closing it means removing it. Kept sorted so the stored value
// does not shuffle on every edit.
function withDay(hours: DayHours[], day: number, ranges: Range[]): DayHours[] {
  const others = hours.filter((h) => h.day !== day);
  if (ranges.length === 0) return others.sort((a, b) => a.day - b.day);
  return [...others, { day, ranges }].sort((a, b) => a.day - b.day);
}

export function AppointmentForm({
  blockId,
  defaultValues,
}: {
  blockId: string;
  defaultValues: AppointmentContent;
}) {
  const setBlockContent = useEditorStore((s) => s.setBlockContent);
  const { register, control, watch } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentContentSchema),
    defaultValues,
  });
  const services = useFieldArray({ control, name: "services" });
  const values = watch();

  const status = useAutosave(
    values,
    async (v) => {
      await updateBlockContent(blockId, appointmentContentSchema.parse(v));
    },
    800,
    (v) => setBlockContent(blockId, v)
  );

  // Numbers arrive from <input type="number"> as strings; valueAsNumber keeps
  // the Zod schema seeing a number instead of failing on "30".
  const numeric = { valueAsNumber: true } as const;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Titre">
        <input {...register("title")} className={inputClass} />
      </Field>
      <Field label="Description">
        <textarea {...register("description")} rows={2} className={inputClass} />
      </Field>

      <Field label="Aide à la saisie (champ « précisions »)">
        <input
          {...register("notePlaceholder")}
          placeholder="Ex : étage, code d’accès, surface…"
          className={inputClass}
        />
      </Field>

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Vos prestations</legend>
        <p className="text-xs text-neutral-500">
          La durée décide des créneaux proposés : une prestation de 90 minutes occupe la place
          jusqu&apos;à 90 minutes plus tard.
        </p>
        {services.fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2 rounded border border-neutral-200 p-2">
            <input
              {...register(`services.${index}.name`)}
              placeholder="Nom (ex : Coupe femme)"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={5}
                step={5}
                {...register(`services.${index}.durationMinutes`, numeric)}
                placeholder="Durée (min)"
                className={inputClass}
              />
              <input
                {...register(`services.${index}.price`)}
                placeholder="Prix (ex : 35€)"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => services.remove(index)}
              disabled={services.fields.length <= 1}
              className="self-start text-xs text-red-600 disabled:opacity-40"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => services.append({ name: "", durationMinutes: 30, price: "" })}
          disabled={services.fields.length >= 12}
          className="self-start text-xs text-neutral-700 underline disabled:opacity-40"
        >
          + Ajouter une prestation
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Vos disponibilités</legend>
        <p className="text-xs text-neutral-500">
          Une plage par demi-journée : 9h30–12h30 puis 14h–19h, et rien ne sera proposé pendant la
          pause. Modifiable à tout moment, la prise de rendez-vous suit immédiatement.
        </p>

        <Controller
          control={control}
          name="hours"
          render={({ field }) => {
            const hours: DayHours[] = (field.value ?? []) as DayHours[];
            return (
              <div className="flex flex-col gap-2">
                {WEEKDAYS.map((day) => {
                  const entry = hours.find((h) => h.day === day.value);
                  const ranges = entry?.ranges ?? [];
                  const open = ranges.length > 0;

                  return (
                    <div
                      key={day.value}
                      className="flex flex-col gap-2 rounded border border-neutral-200 p-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">{day.label}</span>
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(
                              withDay(
                                hours,
                                day.value,
                                open ? [] : [{ start: "09:00", end: "18:00" }]
                              )
                            )
                          }
                          className={`rounded-md border px-2.5 py-1 text-xs ${
                            open
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-300 text-neutral-500"
                          }`}
                        >
                          {open ? "Ouvert" : "Fermé"}
                        </button>
                      </div>

                      {open && (
                        <div className="flex flex-col gap-1.5">
                          {ranges.map((range, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                type="time"
                                value={range.start}
                                onChange={(e) =>
                                  field.onChange(
                                    withDay(
                                      hours,
                                      day.value,
                                      ranges.map((r, j) =>
                                        j === i ? { ...r, start: e.target.value } : r
                                      )
                                    )
                                  )
                                }
                                aria-label={`${day.label} — début de la plage ${i + 1}`}
                                className={`${inputClass} flex-1`}
                              />
                              <span className="text-xs text-neutral-400">→</span>
                              <input
                                type="time"
                                value={range.end}
                                onChange={(e) =>
                                  field.onChange(
                                    withDay(
                                      hours,
                                      day.value,
                                      ranges.map((r, j) =>
                                        j === i ? { ...r, end: e.target.value } : r
                                      )
                                    )
                                  )
                                }
                                aria-label={`${day.label} — fin de la plage ${i + 1}`}
                                className={`${inputClass} flex-1`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    withDay(
                                      hours,
                                      day.value,
                                      ranges.filter((_, j) => j !== i)
                                    )
                                  )
                                }
                                aria-label={`Retirer la plage ${i + 1} du ${day.label}`}
                                className="px-1 text-neutral-400 hover:text-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          {ranges.length < 4 && (
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  withDay(hours, day.value, [
                                    ...ranges,
                                    { start: "14:00", end: "19:00" },
                                  ])
                                )
                              }
                              className="w-fit rounded-md border border-dashed border-neutral-300 px-2.5 py-1 text-xs text-neutral-500"
                            >
                              + Plage horaire
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Fermetures</legend>
        <p className="text-xs text-neutral-500">
          Congés, jours fériés : ces dates ne sont jamais proposées, même si le jour est ouvert.
        </p>
        <Controller
          control={control}
          name="closedDates"
          render={({ field }) => {
            const dates: string[] = (field.value ?? []) as string[];
            return (
              <div className="flex flex-col gap-1.5">
                {dates.map((date, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        field.onChange(dates.map((d, j) => (j === i ? e.target.value : d)))
                      }
                      aria-label={`Fermeture ${i + 1}`}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => field.onChange(dates.filter((_, j) => j !== i))}
                      aria-label={`Retirer la fermeture du ${date}`}
                      className="px-2 text-neutral-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {dates.length < 60 && (
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange([...dates, new Date().toISOString().slice(0, 10)])
                    }
                    className="w-fit rounded-md border border-dashed border-neutral-300 px-2.5 py-1 text-xs text-neutral-500"
                  >
                    + Jour de fermeture
                  </button>
                )}
              </div>
            );
          }}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-medium text-neutral-500">Réglages</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rendez-vous simultanés">
            <input type="number" min={1} {...register("staffCount", numeric)} className={inputClass} />
          </Field>
          <Field label="Pas des créneaux (min)">
            <input type="number" min={5} step={5} {...register("slotStep", numeric)} className={inputClass} />
          </Field>
        </div>
        <p className="text-xs text-neutral-500">
          « Rendez-vous simultanés » = combien de personnes ou d’équipes travaillent en parallèle.
          À 2, deux clients peuvent réserver le même créneau.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prévenance (h)">
            <input type="number" min={0} {...register("noticeHours", numeric)} className={inputClass} />
          </Field>
          <Field label="Horizon (jours)">
            <input type="number" min={1} {...register("maxDaysAhead", numeric)} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <Field label="Téléphone">
        <input {...register("phone")} placeholder="01 23 45 67 89" className={inputClass} />
      </Field>
      <Field label="Email de notification">
        <input
          {...register("notifyEmail")}
          type="email"
          placeholder="Laissez vide pour utiliser l'email du compte"
          className={inputClass}
        />
      </Field>

      <SaveIndicator status={status} />
    </div>
  );
}
