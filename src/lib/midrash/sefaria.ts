import { childRef } from "./refs";
import type { ReaderSegment, SefariaIndex, SefariaText } from "./types";

const BASE = "https://www.sefaria.org/api";
const memory = new Map<string, unknown>();
const INDEX_PREFIX = "midrasj-nl-index:";
const TEXT_PREFIX = "midrasj-nl-text:";

function cacheGet<T>(key: string): T | null {
  if (memory.has(key)) return memory.get(key) as T;
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    memory.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function cacheSet(key: string, value: unknown) {
  memory.set(key, value);
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

async function sefariaGet<T>(path: string): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Sefaria gaf ${res.status} voor ${path}`);
  }
  return (await res.json()) as T;
}

export async function fetchSefariaText(apiRef: string): Promise<SefariaText> {
  const key = TEXT_PREFIX + apiRef;
  const cached = cacheGet<SefariaText>(key);
  if (cached?.ref) return cached;
  const encoded = encodeURI(apiRef);
  const data = await sefariaGet<SefariaText>(
    `/texts/${encoded}?context=0&pad=0`,
  );
  cacheSet(key, data);
  return data;
}

export async function fetchSefariaIndex(title: string): Promise<SefariaIndex> {
  const key = INDEX_PREFIX + title;
  const cached = cacheGet<SefariaIndex>(key);
  if (cached?.schema) return cached;
  const data = await sefariaGet<SefariaIndex>(
    `/index/${encodeURI(title)}?with_content_counts=1`,
  );
  cacheSet(key, data);
  return data;
}

function isStringList(value: unknown): value is Array<string | null | undefined> {
  return Array.isArray(value) && value.every((item) => item == null || typeof item === "string");
}

function asArray(value: unknown): unknown[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

export function flattenSegments(en: unknown, he: unknown, baseRef: string): ReaderSegment[] {
  if (Array.isArray(en) || Array.isArray(he)) {
    const enArr = asArray(en);
    const heArr = asArray(he);
    if (isStringList(enArr) && isStringList(heArr)) {
      const n = Math.max(enArr.length, heArr.length);
      const out: ReaderSegment[] = [];
      for (let i = 0; i < n; i += 1) {
        out.push({
          ref: childRef(baseRef, i + 1),
          en: String(enArr[i] ?? ""),
          he: String(heArr[i] ?? ""),
        });
      }
      return out;
    }
    const n = Math.max(enArr.length, heArr.length);
    const out: ReaderSegment[] = [];
    for (let i = 0; i < n; i += 1) {
      const child = childRef(baseRef, i + 1);
      const nested = flattenSegments(enArr[i], heArr[i], child);
      if (nested.length === 1 && nested[0].ref === `${child}:1` && !Array.isArray(enArr[i]) && !Array.isArray(heArr[i])) {
        out.push({ ref: child, en: nested[0].en, he: nested[0].he });
      } else {
        for (const seg of nested) {
          out.push({ ...seg, group: child });
        }
      }
    }
    return out;
  }
  if (typeof en === "string" || typeof he === "string") {
    return [{ ref: baseRef, en: String(en ?? ""), he: String(he ?? "") }];
  }
  return [];
}

export function segmentsFromText(data: SefariaText): ReaderSegment[] {
  return flattenSegments(data.text, data.he, data.ref).filter(
    (seg) => seg.en.trim() || seg.he.trim(),
  );
}
