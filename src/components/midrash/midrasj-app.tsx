import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Languages,
  Loader2,
  Menu,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/midrash/sidebar";
import { SegmentRow } from "@/components/midrash/segment-row";
import { SettingsDialog } from "@/components/midrash/settings-dialog";
import {
  defaultTanchumaBuber,
  defaultTanchumaPrinted,
  parashotFromTanchumaIndex,
  RABBAH_BOOKS,
} from "@/lib/midrash/catalog";
import {
  corpusSize,
  countMatching,
  downloadCorpus,
  loadCorpus,
  loadSeed,
  mergeCorpus,
  parseImportedCorpus,
  saveCorpus,
  upsertSegment,
} from "@/lib/midrash/corpus";
import { htmlToPlain } from "@/lib/midrash/html";
import {
  currentHash,
  sefariaPageUrl,
  sefariaRefToHash,
  segmentBelongsToBook,
  setHash,
  unitLabel,
  workKindFromApiRef,
} from "@/lib/midrash/refs";
import { fetchSefariaIndex, fetchSefariaText, segmentsFromText } from "@/lib/midrash/sefaria";
import { loadSettings, saveSettings } from "@/lib/midrash/settings";
import { translateEnglish } from "@/lib/midrash/translate";
import type {
  Corpus,
  Parasha,
  ReaderSegment,
  SefariaIndex,
  SefariaText,
  TranslatorSettings,
} from "@/lib/midrash/types";

const DEFAULT_HASH = "Bereshit_Rabbah.1";

function jumpNumber(apiRef: string, n: number): string {
  if (/\.\d+$/.test(apiRef)) return apiRef.replace(/\.\d+$/, `.${n}`);
  if (apiRef.includes(",_Petichta")) return `${apiRef.split(",_")[0]}.${n}`;
  return `${apiRef}.${n}`;
}

function currentNumber(apiRef: string): string {
  const m = apiRef.match(/\.(\d+)$/);
  return m ? m[1] : "";
}

export function MidrasjApp() {
  const [hash, setHashState] = useState(DEFAULT_HASH);
  const [corpus, setCorpus] = useState<Corpus>({ segments: {} });
  const [settings, setSettings] = useState<TranslatorSettings>(loadSettings);
  const [text, setText] = useState<SefariaText | null>(null);
  const [segments, setSegments] = useState<ReaderSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexes, setIndexes] = useState<Record<string, SefariaIndex>>({});
  const [tanchuma, setTanchuma] = useState<Parasha[]>(defaultTanchumaPrinted);
  const [buber, setBuber] = useState<Parasha[]>(defaultTanchumaBuber);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [batch, setBatch] = useState<{ current: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cancelBatch = useRef(false);

  const persist = useCallback((next: Corpus) => {
    setCorpus(next);
    saveCorpus(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const applyHash = () => {
      const next = currentHash();
      setHashState(next || DEFAULT_HASH);
      if (!window.location.hash) setHash(DEFAULT_HASH);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);

    (async () => {
      const local = loadCorpus();
      const seed = await loadSeed();
      const merged = mergeCorpus(seed, local);
      if (!cancelled) persist(merged);
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", applyHash);
    };
  }, [persist]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [printed, buberIdx, ...rabbah] = await Promise.all([
          fetchSefariaIndex("Midrash_Tanchuma"),
          fetchSefariaIndex("Midrash_Tanchuma_Buber"),
          ...RABBAH_BOOKS.map((b) => fetchSefariaIndex(b.slug).catch(() => null)),
        ]);
        if (cancelled) return;
        const nextIndexes: Record<string, SefariaIndex> = {};
        RABBAH_BOOKS.forEach((book, i) => {
          const idx = rabbah[i];
          if (idx) nextIndexes[book.slug] = idx;
        });
        setIndexes(nextIndexes);
        const printedNodes = parashotFromTanchumaIndex("Midrash_Tanchuma", printed);
        const buberNodes = parashotFromTanchumaIndex("Midrash_Tanchuma_Buber", buberIdx);
        if (printedNodes.length) setTanchuma(printedNodes);
        if (buberNodes.length) setBuber(buberNodes);
      } catch {
        /* fallback catalog remains */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setText(null);
    setSegments([]);
    (async () => {
      try {
        const data = await fetchSefariaText(hash);
        if (cancelled) return;
        setText(data);
        setSegments(segmentsFromText(data));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Kon de tekst niet ophalen bij Sefaria.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hash]);

  const navigate = useCallback((apiRef: string) => {
    setSidebarOpen(false);
    setHash(apiRef);
  }, []);

  const saveNl = useCallback(
    (
      ref: string,
      nl: string,
      status: "concept" | "reviewed" | "seed",
      source: "machine" | "chat" | "manual" | "seed",
    ) => {
      persist(
        upsertSegment(corpus, ref, {
          nl,
          status,
          source,
          version: text?.versionTitle,
        }),
      );
    },
    [corpus, persist, text?.versionTitle],
  );

  const translateOne = useCallback(
    async (ref: string) => {
      const seg = segments.find((s) => s.ref === ref);
      if (!seg) return;
      if (!htmlToPlain(seg.en)) {
        toast.error("Geen Engelse brontekst; typ de vertaling handmatig.");
        return;
      }
      setBusyRef(ref);
      try {
        const { nl, source } = await translateEnglish(seg.en, settings);
        saveNl(ref, nl, "concept", source);
        toast.success(`Concept bewaard voor ${ref}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Vertalen mislukt");
        if (err instanceof Error && /sleutel/i.test(err.message)) setSettingsOpen(true);
      } finally {
        setBusyRef(null);
      }
    },
    [saveNl, segments, settings],
  );

  const translateMissing = useCallback(async () => {
    const missing = segments.filter((s) => !corpus.segments[s.ref] && htmlToPlain(s.en));
    if (!missing.length) {
      toast.message("Geen ontbrekende alinea’s in dit gedeelte.");
      return;
    }
    cancelBatch.current = false;
    setBatch({ current: 0, total: missing.length });
    let done = 0;
    for (const seg of missing) {
      if (cancelBatch.current) break;
      setBusyRef(seg.ref);
      try {
        const { nl, source } = await translateEnglish(seg.en, settings);
        setCorpus((prev) => {
          const next = upsertSegment(prev, seg.ref, {
            nl,
            status: "concept",
            source,
            version: text?.versionTitle,
          });
          saveCorpus(next);
          return next;
        });
        done += 1;
        setBatch({ current: done, total: missing.length });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Vertalen gestopt");
        if (err instanceof Error && /sleutel/i.test(err.message)) setSettingsOpen(true);
        break;
      }
      await new Promise((r) => setTimeout(r, 350));
    }
    setBusyRef(null);
    setBatch(null);
    if (done) toast.success(`${done} conceptvertaling${done === 1 ? "" : "en"} toegevoegd.`);
  }, [corpus.segments, segments, settings, text?.versionTitle]);

  const onImport = useCallback(
    async (file: File) => {
      try {
        const raw = await file.text();
        const incoming = parseImportedCorpus(raw);
        const next = mergeCorpus(corpus, incoming);
        persist(next);
        toast.success("Corpus geïmporteerd en samengevoegd.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Import mislukt");
      }
    },
    [corpus, persist],
  );

  const kind = workKindFromApiRef(hash);
  const navKind = kind === "rabbah" ? (hash.includes("Petichta") ? "petichta" : "chapter") : "siman";
  const size = corpusSize(corpus);
  const workTitle = text?.indexTitle;
  const currentBookNl = workTitle
    ? countMatching(corpus, (ref) => segmentBelongsToBook(ref, workTitle))
    : 0;

  const jumpInput = currentNumber(hash);
  const prevHash = text?.prev ? sefariaRefToHash(text.prev) : "";
  const nextHash = text?.next ? sefariaRefToHash(text.next) : "";
  const title = text?.ref ?? hash.replace(/_/g, " ");
  const heTitle = text?.heRef ?? "";

  const headerButtons = (
    <>
      <Button
        type="button"
        variant="default"
        size="sm"
        disabled={Boolean(batch) || loading}
        onClick={() => void translateMissing()}
      >
        {batch ? <Loader2 className="animate-spin" /> : <Languages />}
        <span className="hidden sm:inline">
          {batch ? `Vertalen ${batch.current}/${batch.total}` : "Vertaal ontbrekende alinea’s"}
        </span>
        <span className="sm:hidden">Vertaal</span>
      </Button>
      {batch ? (
        <Button type="button" size="sm" variant="outline" onClick={() => (cancelBatch.current = true)}>
          Stop
        </Button>
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={() => downloadCorpus(corpus)}>
        <Download />
        <span className="hidden md:inline">Exporteer corpus</span>
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
        <Upload />
        <span className="hidden md:inline">Importeer JSON</span>
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
        <Settings />
        <span className="hidden md:inline">Instellingen</span>
      </Button>
    </>
  );

  const sidebarEl = (
    <Sidebar
      hash={hash}
      corpus={corpus}
      indexes={indexes}
      tanchuma={tanchuma}
      buber={buber}
      onNavigate={navigate}
    />
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-paper text-ink border-border font-sans",
          },
        }}
      />
      <a
        href="#hoofdinhoud"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2"
      >
        Ga naar de tekst
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-cream/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-3 py-3 sm:px-5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open collecties"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="inline-block h-5 w-1.5 rounded-full bg-bordeaux" aria-hidden />
              <h1 className="font-serif text-xl tracking-tight text-ink sm:text-2xl">Midrasj NL</h1>
            </div>
            <p className="ml-3.5 truncate font-sans text-xs text-muted sm:text-sm">
              Nederlandse lees- en vertaalomgeving voor klassieke midrasj
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">{headerButtons}</div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-80 shrink-0 border-r border-border bg-paper/70 lg:block">
          {sidebarEl}
        </aside>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Sluit zijbalk"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex h-full w-[min(20rem,90vw)] flex-col bg-paper shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-3 py-3">
                <span className="font-serif text-lg">Collecties</span>
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => setSidebarOpen(false)}>
                  <X />
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">{sidebarEl}</div>
            </div>
          </div>
        ) : null}

        <main id="hoofdinhoud" className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-rule pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
                  {heTitle ? (
                    <p className="font-hebrew mt-1 text-xl text-navy" dir="rtl" lang="he">
                      {heTitle}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!prevHash}
                    onClick={() => prevHash && navigate(prevHash)}
                  >
                    <ChevronLeft />
                    Vorige
                  </Button>
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const n = Number(fd.get("unit"));
                      if (Number.isFinite(n) && n > 0) navigate(jumpNumber(hash, n));
                    }}
                  >
                    <label className="font-sans text-xs text-muted" htmlFor="unit-jump">
                      {unitLabel(navKind)}
                    </label>
                    <Input
                      id="unit-jump"
                      name="unit"
                      type="number"
                      min={1}
                      defaultValue={jumpInput}
                      key={hash}
                      className="h-8 w-16 px-2 text-center tabular-nums"
                    />
                  </form>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!nextHash}
                    onClick={() => nextHash && navigate(nextHash)}
                  >
                    Volgende
                    <ChevronRight />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="chip">Corpus {size} alinea’s</Badge>
                {text?.versionTitle ? <Badge variant="chip">{text.versionTitle}</Badge> : null}
                {text?.license ? <Badge variant="license">{text.license}</Badge> : null}
                {currentBookNl ? (
                  <Badge variant="seed">{currentBookNl} NL in dit werk</Badge>
                ) : null}
                {text ? (
                  <a
                    className="inline-flex items-center rounded-full border border-border bg-paper px-2 py-0.5 font-sans text-[11px] text-navy hover:bg-cream"
                    href={sefariaPageUrl(text.ref)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open op Sefaria
                  </a>
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="space-y-6" aria-busy="true" aria-live="polite">
                <p className="font-sans text-sm text-muted">Tekst ophalen bij Sefaria…</p>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="h-40 animate-pulse rounded-lg bg-border/40" />
                    <div className="h-40 animate-pulse rounded-lg bg-border/40" />
                    <div className="h-40 animate-pulse rounded-lg bg-border/40" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-bordeaux/30 bg-paper p-6">
                <h3 className="font-serif text-xl text-bordeaux">Kon deze tekst niet laden</h3>
                <p className="mt-2 font-sans text-sm text-muted">{error}</p>
                <p className="mt-3 font-sans text-sm text-muted">
                  Controleer de verwijzing in de adresbalk, of kies een hoofdstuk in de zijbalk.
                </p>
              </div>
            ) : (
              <div>
                {segments.map((seg) => (
                  <SegmentRow
                    key={seg.ref}
                    segment={seg}
                    entry={corpus.segments[seg.ref]}
                    busy={busyRef === seg.ref}
                    onTranslate={(ref) => void translateOne(ref)}
                    onSave={(ref, nl) => {
                      saveNl(ref, nl, "concept", "manual");
                      toast.success("Bewerking bewaard");
                    }}
                    onReview={(ref, nl) => {
                      saveNl(ref, nl, "reviewed", corpus.segments[ref]?.source ?? "manual");
                      toast.success("Gemarkeerd als nagekeken");
                    }}
                  />
                ))}
                {!segments.length ? (
                  <p className="font-sans text-sm text-muted">Geen alinea’s in dit gedeelte.</p>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="border-t border-border bg-paper/80 px-4 py-5 text-center font-sans text-xs leading-relaxed text-muted sm:px-6">
        <p>
          Hebreeuws en Engels via de publieke{" "}
          <a className="text-navy underline-offset-2 hover:underline" href="https://www.sefaria.org" target="_blank" rel="noreferrer">
            Sefaria API
          </a>
          . Engelse Midrash Rabbah: <em>The Sefaria Midrash Rabbah, 2022</em> (CC-BY). Tanchuma gedrukt:
          Samuel A. Berman, <em>Midrash Tanhuma-Yelammedenu</em> (CC-BY). Tanchuma Boeber: John T.
          Townsend, 1989 (CC-BY); Hebreeuws vaak Buber 1885, publiek domein. Geen Soncino-tekst.
        </p>
        <p className="mt-2">
          Conceptvertalingen zijn machinehulp en hebben menselijke controle nodig. Midrasj NL claimt
          geen rabbinaal toezicht.
        </p>
      </footer>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onImport(file);
          e.target.value = "";
        }}
      />

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onOpenChange={setSettingsOpen}
        onSave={(next) => {
          setSettings(next);
          saveSettings(next);
          toast.success("Instellingen bewaard");
        }}
      />
    </div>
  );
}
