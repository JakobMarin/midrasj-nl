import type { Corpus, CorpusSegment } from "./types";

export const CORPUS_KEY = "midrasj-nl-corpus-v1";

export const EMPTY_CORPUS: Corpus = { segments: {} };

export function loadCorpus(): Corpus {
  if (typeof localStorage === "undefined") return EMPTY_CORPUS;
  try {
    const raw = localStorage.getItem(CORPUS_KEY);
    if (!raw) return EMPTY_CORPUS;
    const parsed = JSON.parse(raw) as Corpus;
    if (!parsed || typeof parsed !== "object" || !parsed.segments) return EMPTY_CORPUS;
    return parsed;
  } catch {
    return EMPTY_CORPUS;
  }
}

export function saveCorpus(corpus: Corpus) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CORPUS_KEY, JSON.stringify(corpus));
}

export function mergeCorpus(base: Corpus, incoming: Corpus): Corpus {
  const segments = { ...base.segments };
  for (const [ref, seg] of Object.entries(incoming.segments ?? {})) {
    if (!seg || typeof seg.nl !== "string") continue;
    segments[ref] = {
      nl: seg.nl,
      status: seg.status === "reviewed" || seg.status === "seed" || seg.status === "concept" ? seg.status : "concept",
      source: seg.source ?? "manual",
      updated: seg.updated ?? new Date().toISOString(),
      version: seg.version,
    };
  }
  return { segments };
}

export function upsertSegment(
  corpus: Corpus,
  ref: string,
  patch: Partial<CorpusSegment> & { nl: string },
): Corpus {
  const prev = corpus.segments[ref];
  const next: CorpusSegment = {
    nl: patch.nl,
    status: patch.status ?? prev?.status ?? "concept",
    source: patch.source ?? prev?.source ?? "manual",
    updated: patch.updated ?? new Date().toISOString(),
    version: patch.version ?? prev?.version,
  };
  return {
    segments: {
      ...corpus.segments,
      [ref]: next,
    },
  };
}

export function corpusSize(corpus: Corpus): number {
  return Object.keys(corpus.segments).length;
}

export function countMatching(
  corpus: Corpus,
  predicate: (ref: string) => boolean,
): number {
  let n = 0;
  for (const ref of Object.keys(corpus.segments)) {
    if (predicate(ref)) n += 1;
  }
  return n;
}

export async function loadSeed(): Promise<Corpus> {
  try {
    const res = await fetch("/data/seed.json", { cache: "no-cache" });
    if (!res.ok) return EMPTY_CORPUS;
    return (await res.json()) as Corpus;
  } catch {
    return EMPTY_CORPUS;
  }
}

export function downloadCorpus(corpus: Corpus) {
  const blob = new Blob([JSON.stringify(corpus, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "midrasj-nl-corpus.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportedCorpus(raw: string): Corpus {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") throw new Error("Ongeldig JSON-bestand");
  const obj = parsed as { segments?: unknown };
  if (!obj.segments || typeof obj.segments !== "object") {
    throw new Error("JSON mist een segments-object");
  }
  return obj as Corpus;
}
