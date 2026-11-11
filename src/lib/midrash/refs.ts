/** Convert a Sefaria display ref to the hash / API path. */
export function sefariaRefToHash(ref: string): string {
  const trimmed = ref.trim();
  if (!trimmed) return "";

  const comma = trimmed.indexOf(",");
  if (comma !== -1) {
    const work = trimmed.slice(0, comma).trim().replace(/ /g, "_");
    const rest = trimmed.slice(comma + 1).trim();
    const numbered = rest.match(/^(.*)\s+(\d+(?::\d+)*)$/);
    if (numbered) {
      const parasha = numbered[1].replace(/ /g, "_");
      const nums = numbered[2].replace(/:/g, ".");
      return `${work},_${parasha}.${nums}`;
    }
    return `${work},_${rest.replace(/ /g, "_")}`;
  }

  const numbered = trimmed.match(/^(.*)\s+(\d+(?::\d+)*)$/);
  if (numbered) {
    const book = numbered[1].replace(/ /g, "_");
    const nums = numbered[2].replace(/:/g, ".");
    return `${book}.${nums}`;
  }
  return trimmed.replace(/ /g, "_");
}

export function hashToApiRef(hash: string): string {
  return hash.replace(/^#/, "").trim();
}

export function childRef(parent: string, index: number): string {
  if (/\d$/.test(parent.trim())) return `${parent}:${index}`;
  return `${parent} ${index}`;
}

export function currentHash(): string {
  if (typeof window === "undefined") return "Bereshit_Rabbah.1";
  return hashToApiRef(decodeURIComponent(window.location.hash || "")) || "Bereshit_Rabbah.1";
}

export function setHash(apiRef: string) {
  if (typeof window === "undefined") return;
  const next = `#${apiRef}`;
  if (window.location.hash === next) return;
  window.location.hash = apiRef;
}

export function displayTitleFromApiRef(apiRef: string): string {
  const comma = apiRef.indexOf(",_");
  if (comma !== -1) {
    const work = apiRef.slice(0, comma).replace(/_/g, " ");
    const rest = apiRef.slice(comma + 2);
    const dot = rest.search(/\.\d/);
    if (dot !== -1) {
      const parasha = rest.slice(0, dot).replace(/_/g, " ");
      const nums = rest.slice(dot + 1).replace(/\./g, ":");
      return `${work}, ${parasha} ${nums}`;
    }
    return `${work}, ${rest.replace(/_/g, " ")}`;
  }
  const match = apiRef.match(/^(.*)\.(\d+(?:\.\d+)*)$/);
  if (match) {
    return `${match[1].replace(/_/g, " ")} ${match[2].replace(/\./g, ":")}`;
  }
  return apiRef.replace(/_/g, " ");
}

/** Prefix match that does not treat "Bereshit Rabbah 1" as a prefix of "… 10". */
export function segmentBelongsToUnit(segmentRef: string, unitDisplayRef: string): boolean {
  if (segmentRef === unitDisplayRef) return true;
  if (segmentRef.startsWith(`${unitDisplayRef}:`)) return true;
  if (segmentRef.startsWith(`${unitDisplayRef} `)) {
    return /^\d/.test(segmentRef.slice(unitDisplayRef.length + 1));
  }
  return false;
}

export function segmentBelongsToBook(segmentRef: string, bookTitle: string): boolean {
  return (
    segmentRef === bookTitle ||
    segmentRef.startsWith(`${bookTitle} `) ||
    segmentRef.startsWith(`${bookTitle},`)
  );
}

export function workKindFromApiRef(apiRef: string): "rabbah" | "tanchuma" | "tanchuma-buber" {
  if (apiRef.startsWith("Midrash_Tanchuma_Buber")) return "tanchuma-buber";
  if (apiRef.startsWith("Midrash_Tanchuma")) return "tanchuma";
  return "rabbah";
}

export function sefariaPageUrl(ref: string): string {
  return `https://www.sefaria.org/${encodeURI(ref.replace(/ /g, "_"))}`;
}

export function unitLabel(kind: "chapter" | "petichta" | "siman"): string {
  if (kind === "siman") return "Siman";
  if (kind === "petichta") return "Petichta";
  return "Hoofdstuk";
}
