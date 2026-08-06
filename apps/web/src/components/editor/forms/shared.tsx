import type { SaveStatus } from "../use-autosave";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}

export const inputClass = "rounded-md border border-neutral-300 px-3 py-2 text-sm";

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <p className="text-xs text-neutral-400">
      {status === "saving" && "Enregistrement…"}
      {status === "saved" && "Enregistré"}
      {status === "error" && <span className="text-red-600">Échec de l&apos;enregistrement</span>}
    </p>
  );
}
