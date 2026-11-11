import { useEffect, useState } from "react";
import { Check, Languages, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { dutchToHtml, htmlToPlain, sanitizeReadingHtml } from "@/lib/midrash/html";
import type { CorpusSegment, ReaderSegment } from "@/lib/midrash/types";

type Props = {
  segment: ReaderSegment;
  entry?: CorpusSegment;
  busy?: boolean;
  onTranslate: (ref: string) => void;
  onSave: (ref: string, nl: string) => void;
  onReview: (ref: string, nl: string) => void;
};

function statusMeta(entry?: CorpusSegment): {
  variant: "missing" | "concept" | "reviewed" | "seed";
  label: string;
} {
  if (!entry) return { variant: "missing", label: "nog niet" };
  if (entry.source === "seed" || entry.status === "seed") {
    return { variant: "seed", label: "startvertaling" };
  }
  if (entry.status === "reviewed") return { variant: "reviewed", label: "nagekeken" };
  return { variant: "concept", label: "concept" };
}

export function SegmentRow({
  segment,
  entry,
  busy,
  onTranslate,
  onSave,
  onReview,
}: Props) {
  const [draft, setDraft] = useState(entry?.nl ?? "");

  useEffect(() => {
    setDraft(entry?.nl ?? "");
  }, [entry?.nl, segment.ref]);

  const heHtml = sanitizeReadingHtml(segment.he);
  const enHtml = sanitizeReadingHtml(segment.en);
  const status = statusMeta(entry);
  const dirty = draft !== (entry?.nl ?? "");
  const canTranslate = htmlToPlain(segment.en).length > 1;

  return (
    <article className="border-b border-border/90 py-6 last:border-b-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs tracking-wide text-muted uppercase">
            {segment.ref}
          </span>
          {segment.group ? (
            <span className="font-sans text-[11px] text-muted">{segment.group}</span>
          ) : null}
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <section>
          <h3 className="mb-2 font-sans text-[11px] font-medium tracking-[0.14em] text-navy uppercase">
            Hebreeuws
          </h3>
          <div
            dir="rtl"
            lang="he"
            className="reading-he font-hebrew he-scroll max-h-[28rem] overflow-y-auto rounded-lg border border-border bg-paper px-4 py-3 text-[1.15rem] leading-[1.85] text-ink"
            dangerouslySetInnerHTML={{
              __html: heHtml || "<span class='text-muted'>Geen Hebreeuwse tekst.</span>",
            }}
          />
        </section>

        <section>
          <h3 className="mb-2 font-sans text-[11px] font-medium tracking-[0.14em] text-navy uppercase">
            Engels
          </h3>
          <div
            lang="en"
            className="reading-en he-scroll max-h-[28rem] overflow-y-auto rounded-lg border border-border bg-paper px-4 py-3 font-serif text-[0.98rem] leading-[1.7] text-ink"
            dangerouslySetInnerHTML={{
              __html: enHtml || "<span class='text-muted'>Geen Engelse tekst.</span>",
            }}
          />
        </section>

        <section>
          <h3 className="mb-2 font-sans text-[11px] font-medium tracking-[0.14em] text-navy uppercase">
            Nederlands
          </h3>
          <Textarea
            aria-label={`Nederlandse tekst voor ${segment.ref}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Nog geen Nederlandse tekst. Vertaal of typ hier."
            className="min-h-40 lg:min-h-48"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="default"
              disabled={busy || !canTranslate}
              onClick={() => onTranslate(segment.ref)}
            >
              {busy ? <Loader2 className="animate-spin" /> : <Languages />}
              Vertaal
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!draft.trim() || (!dirty && Boolean(entry))}
              onClick={() => onSave(segment.ref, draft)}
            >
              <Save />
              Bewaar bewerking
            </Button>
            <Button
              type="button"
              size="sm"
              variant="navy"
              disabled={!draft.trim()}
              onClick={() => onReview(segment.ref, draft)}
            >
              <Check />
              Markeer nagekeken
            </Button>
          </div>
          {draft && !dirty ? (
            <p
              className="reading-en mt-3 hidden font-serif text-sm leading-relaxed text-ink/80 lg:block"
              dangerouslySetInnerHTML={{ __html: dutchToHtml(draft) }}
            />
          ) : null}
        </section>
      </div>
    </article>
  );
}
