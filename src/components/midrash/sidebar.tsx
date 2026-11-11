import { useMemo, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RABBAH_BOOKS,
  rabbahUnits,
  tanchumaSimanUnits,
} from "@/lib/midrash/catalog";
import { countMatching } from "@/lib/midrash/corpus";
import { segmentBelongsToBook, segmentBelongsToUnit } from "@/lib/midrash/refs";
import { displayTitleFromApiRef } from "@/lib/midrash/refs";
import type { Corpus, NavUnit, Parasha, SefariaIndex } from "@/lib/midrash/types";

type Props = {
  hash: string;
  corpus: Corpus;
  indexes: Record<string, SefariaIndex>;
  tanchuma: Parasha[];
  buber: Parasha[];
  onNavigate: (apiRef: string) => void;
};

function unitCount(corpus: Corpus, unit: NavUnit): number {
  const display = displayTitleFromApiRef(unit.apiRef);
  return countMatching(corpus, (ref) => segmentBelongsToUnit(ref, display));
}

function UnitGrid({
  units,
  hash,
  corpus,
  onNavigate,
}: {
  units: NavUnit[];
  hash: string;
  corpus: Corpus;
  onNavigate: (apiRef: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1 p-2">
      {units.map((unit) => {
        const active = hash === unit.apiRef;
        const n = unitCount(corpus, unit);
        const total = unit.paragraphCount;
        const filled = n > 0;
        const complete = total > 0 && n >= total;
        return (
          <button
            key={unit.apiRef}
            type="button"
            title={
              unit.kind === "petichta"
                ? `Petichta${n ? ` · ${n} NL` : ""}`
                : `${unit.kind === "siman" ? "Siman" : "Hoofdstuk"} ${unit.label}${n ? ` · ${n} NL` : ""}`
            }
            onClick={() => onNavigate(unit.apiRef)}
            className={cn(
              "relative flex h-9 items-center justify-center rounded-md font-sans text-[11px] tabular-nums transition-colors duration-150",
              active
                ? "bg-bordeaux text-paper"
                : complete
                  ? "bg-navy/10 text-navy hover:bg-navy/16"
                  : filled
                    ? "bg-bordeaux/10 text-bordeaux hover:bg-bordeaux/16"
                    : "bg-paper text-ink/80 hover:bg-cream",
            )}
          >
            {unit.kind === "petichta" ? "P" : unit.label}
            {filled && !active ? (
              <span className="absolute top-0.5 right-0.5 size-1 rounded-full bg-bordeaux" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Group({
  title,
  he,
  children,
  defaultOpen,
}: {
  title: string;
  he?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-border/80" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-sans text-[11px] font-medium tracking-[0.16em] text-navy uppercase">
            {title}
          </span>
          {he ? (
            <span className="font-hebrew mt-0.5 block text-sm text-muted" dir="rtl">
              {he}
            </span>
          ) : null}
        </span>
        <ChevronDown className="size-4 text-muted transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}

function ParashaList({
  parashot,
  hash,
  corpus,
  onNavigate,
}: {
  parashot: Parasha[];
  hash: string;
  corpus: Corpus;
  onNavigate: (apiRef: string) => void;
}) {
  return (
    <div>
      {parashot.map((p) => {
        const units = tanchumaSimanUnits(p);
        const bookTitle = `${p.apiBase.startsWith("Midrash_Tanchuma_Buber") ? "Midrash Tanchuma Buber" : "Midrash Tanchuma"}, ${p.title}`;
        const n = countMatching(corpus, (ref) => segmentBelongsToBook(ref, bookTitle));
        const open = hash.startsWith(p.apiBase);
        return (
          <details key={p.apiBase} className="group" open={open || undefined}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 hover:bg-cream/80 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block truncate font-sans text-sm text-ink">{p.title}</span>
                <span className="font-hebrew block text-xs text-muted" dir="rtl">
                  {p.he}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-sans text-[11px] tabular-nums text-muted">
                  {n}
                  {p.paragraphs.some(Boolean)
                    ? `/${p.paragraphs.reduce((a, b) => a + b, 0)}`
                    : ""}
                </span>
                <ChevronDown className="size-3.5 text-muted transition-transform group-open:rotate-180" />
              </span>
            </summary>
            <UnitGrid units={units} hash={hash} corpus={corpus} onNavigate={onNavigate} />
          </details>
        );
      })}
    </div>
  );
}

export function Sidebar({ hash, corpus, indexes, tanchuma, buber, onNavigate }: Props) {
  const rabbahOpen = useMemo(() => !hash.startsWith("Midrash_Tanchuma"), [hash]);

  return (
    <nav aria-label="Collecties" className="he-scroll h-full overflow-y-auto">
      <Group title="Midrasj Rabba" he="מדרש רבה" defaultOpen={rabbahOpen}>
        {RABBAH_BOOKS.map((book) => {
          const units = rabbahUnits(book, indexes[book.slug]);
          const n = countMatching(corpus, (ref) => segmentBelongsToBook(ref, book.title));
          const open = hash.startsWith(book.slug);
          return (
            <details key={book.slug} className="group" open={open || undefined}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 hover:bg-cream/80 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block truncate font-sans text-sm text-ink">{book.dutch}</span>
                  <span className="font-hebrew block text-xs text-muted" dir="rtl">
                    {book.he}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-sans text-[11px] tabular-nums text-muted">{n}</span>
                  <ChevronDown className="size-3.5 text-muted transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <UnitGrid units={units} hash={hash} corpus={corpus} onNavigate={onNavigate} />
            </details>
          );
        })}
      </Group>

      <Group
        title="Tanchuma (gedrukt)"
        he="מדרש תנחומא"
        defaultOpen={hash.startsWith("Midrash_Tanchuma,") || hash.startsWith("Midrash_Tanchuma._")}
      >
        <ParashaList parashot={tanchuma} hash={hash} corpus={corpus} onNavigate={onNavigate} />
      </Group>

      <Group
        title="Tanchuma Boeber"
        he="תנחומא בובר"
        defaultOpen={hash.startsWith("Midrash_Tanchuma_Buber")}
      >
        <ParashaList parashot={buber} hash={hash} corpus={corpus} onNavigate={onNavigate} />
      </Group>
    </nav>
  );
}
