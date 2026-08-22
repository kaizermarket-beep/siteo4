import type { ReactNode } from "react";

/**
 * Marks a value that only the operator of Siteo can supply — company name,
 * SIRET, the hosting provider's real address. Rendered loudly on purpose:
 * a legal page that silently ships with a placeholder is worse than one
 * that obviously has a hole in it.
 */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-amber-900">
      [[À COMPLÉTER : {children}]]
    </span>
  );
}

/** Inline monospace value — a cookie name, a header, a code identifier. */
export function mono(text: string): ReactNode {
  return <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.9em]">{text}</code>;
}

/** Same as <Todo> but callable, for use inside data arrays. */
export function todo(text: string): ReactNode {
  return <Todo>{text}</Todo>;
}

export function LegalHeader({
  title,
  updated,
  intro,
}: {
  title: string;
  updated: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-neutral-200 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{title}</h1>
      <p className="text-sm text-neutral-500">Dernière mise à jour : {updated}</p>
      {intro && <div className="text-neutral-700">{intro}</div>}
    </header>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-neutral-700">
        {children}
      </div>
    </section>
  );
}

export function DefinitionList({
  items,
}: {
  items: { term: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[220px_1fr]">
      {items.map((item) => (
        <div key={item.term} className="contents">
          <dt className="text-sm font-medium text-neutral-500">{item.term}</dt>
          <dd className="text-[15px] text-neutral-800">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-neutral-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            {head.map((h) => (
              <th key={h} className="py-2 pr-4 font-medium text-neutral-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-150 align-top last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-3 pr-4 text-neutral-800">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
