import type { NavUnit, Parasha, RabbahBook, SefariaIndex, SefariaIndexNode } from "./types";

export const RABBAH_BOOKS: RabbahBook[] = [
  { slug: "Bereshit_Rabbah", title: "Bereshit Rabbah", dutch: "Beresjiet Rabba", he: "בראשית רבה", chapters: 100 },
  { slug: "Shemot_Rabbah", title: "Shemot Rabbah", dutch: "Sjemot Rabba", he: "שמות רבה", chapters: 52 },
  { slug: "Vayikra_Rabbah", title: "Vayikra Rabbah", dutch: "Wajikra Rabba", he: "ויקרא רבה", chapters: 37 },
  { slug: "Bamidbar_Rabbah", title: "Bamidbar Rabbah", dutch: "Bemidbar Rabba", he: "במדבר רבה", chapters: 23 },
  { slug: "Devarim_Rabbah", title: "Devarim Rabbah", dutch: "Dewariem Rabba", he: "דברים רבה", chapters: 17 },
  { slug: "Shir_HaShirim_Rabbah", title: "Shir HaShirim Rabbah", dutch: "Sjir Hasjiriem Rabba", he: "שיר השירים רבה", chapters: 8 },
  { slug: "Ruth_Rabbah", title: "Ruth Rabbah", dutch: "Ruth Rabba", he: "רות רבה", chapters: 8, petichta: true },
  { slug: "Eikhah_Rabbah", title: "Eikhah Rabbah", dutch: "Eicha Rabba", he: "איכה רבה", chapters: 5, petichta: true },
  { slug: "Kohelet_Rabbah", title: "Kohelet Rabbah", dutch: "Kohelet Rabba", he: "קוהלת רבה", chapters: 12 },
  { slug: "Esther_Rabbah", title: "Esther Rabbah", dutch: "Ester Rabba", he: "אסתר רבה", chapters: 10, petichta: true },
];

type ParashaSeed = [string, string, number];

const TANCHUMA_PRINTED_SEED: ParashaSeed[] = [
  ["Bereshit", "בראשית", 13],
  ["Noach", "נח", 19],
  ["Lech Lecha", "לך לך", 20],
  ["Vayera", "וירא", 23],
  ["Chayei Sara", "חיי שרה", 8],
  ["Toldot", "תולדות", 14],
  ["Vayetzei", "ויצא", 13],
  ["Vayishlach", "וישלח", 10],
  ["Vayeshev", "וישב", 9],
  ["Miketz", "מקץ", 10],
  ["Vayigash", "ויגש", 11],
  ["Vayechi", "ויחי", 17],
  ["Shemot", "שמות", 29],
  ["Vaera", "וארא", 17],
  ["Bo", "בא", 14],
  ["Beshalach", "בשלח", 28],
  ["Yitro", "יתרו", 17],
  ["Mishpatim", "משפטים", 19],
  ["Terumah", "תרומה", 11],
  ["Tetzaveh", "תצוה", 15],
  ["Ki Tisa", "כי תשא", 37],
  ["Vayakhel", "ויקהל", 20],
  ["Pekudei", "פקודי", 11],
  ["Vayikra", "ויקרא", 8],
  ["Tzav", "צו", 28],
  ["Shmini", "שמיני", 12],
  ["Tazria", "תזריע", 11],
  ["Metzora", "מצורע", 9],
  ["Achrei Mot", "אחרי מות", 12],
  ["Kedoshim", "קדושים", 15],
  ["Emor", "אמור", 24],
  ["Behar", "בהר", 4],
  ["Bechukotai", "בחוקתי", 6],
  ["Bamidbar", "במדבר", 26],
  ["Nasso", "נשא", 54],
  ["Beha'alotcha", "בהעלותך", 16],
  ["Sh'lach", "שלח", 15],
  ["Korach", "קרח", 12],
  ["Chukat", "חקת", 27],
  ["Balak", "בלק", 21],
  ["Pinchas", "פנחס", 17],
  ["Matot", "מטות", 7],
  ["Masei", "מסעי", 13],
  ["Devarim", "דברים", 4],
  ["Vaetchanan", "ואתחנן", 6],
  ["Eikev", "עקב", 11],
  ["Re'eh", "ראה", 18],
  ["Shoftim", "שופטים", 19],
  ["Ki Teitzei", "כי תצא", 11],
  ["Ki Tavo", "כי תבוא", 8],
  ["Nitzavim", "נצבים", 11],
  ["Vayeilech", "וילך", 3],
  ["Ha'Azinu", "האזינו", 8],
  ["V'Zot HaBerachah", "וזאת הברכה", 7],
];

const TANCHUMA_BUBER_SEED: ParashaSeed[] = [
  ["Bereshit", "בראשית", 40],
  ["Noach", "נח", 28],
  ["Lech Lecha", "לך לך", 27],
  ["Vayera", "וירא", 46],
  ["Chayei Sara", "חיי שרה", 10],
  ["Toldot", "תולדות", 24],
  ["Vayetzei", "ויצא", 24],
  ["Vayishlach", "וישלח", 30],
  ["Vayeshev", "וישב", 21],
  ["Miketz", "מקץ", 17],
  ["Vayigash", "ויגש", 12],
  ["Vayechi", "ויחי", 18],
  ["Shemot", "שמות", 26],
  ["Vaera", "וארא", 22],
  ["Bo", "בא", 19],
  ["Beshalach", "בשלח", 24],
  ["Yitro", "יתרו", 17],
  ["Mishpatim", "משפטים", 12],
  ["Terumah", "תרומה", 9],
  ["Tetzaveh", "תצוה", 16],
  ["Ki Tisa", "כי תשא", 20],
  ["Vayakhel", "ויקהל", 11],
  ["Pekudei", "פקודי", 8],
  ["Vayikra", "ויקרא", 18],
  ["Tzav", "צו", 16],
  ["Shmini", "שמיני", 14],
  ["Tazria", "תזריע", 16],
  ["Metzora", "מצורע", 18],
  ["Achrei Mot", "אחרי מות", 18],
  ["Kedoshim", "קדושים", 15],
  ["Emor", "אמור", 32],
  ["Behar", "בהר", 9],
  ["Bechukotai", "בחוקתי", 8],
  ["Bamidbar", "במדבר", 33],
  ["Nasso", "נשא", 34],
  ["Beha'alotcha", "בהעלותך", 28],
  ["Sh'lach", "שלח", 31],
  ["Appendix to Sh'lach", "הוספה לשלח", 21],
  ["Korach", "קרח", 27],
  ["Appendix to Korach", "הוספה לקרח", 5],
  ["Chukat", "חקת", 55],
  ["Appendix to Chukat", "הוספה לחקת", 2],
  ["Balak", "בלק", 30],
  ["Pinchas", "פנחס", 17],
  ["Matot", "מטות", 9],
  ["Masei", "מסעי", 10],
  ["Devarim", "דברים", 5],
  ["Appendix to Devarim", "הוספה לדברים", 10],
  ["Vaetchanan", "ואתחנן", 6],
  ["Appendix to Vaetchanan", "הוספה לואתחנן", 5],
  ["Eikev", "עקב", 6],
  ["Re'eh", "ראה", 17],
  ["Appendix to Re'eh", "הוספה לראה", 1],
  ["Shoftim", "שופטים", 10],
  ["Ki Teitzei", "כי תצא", 18],
  ["Ki Tavo", "כי תבוא", 4],
  ["Nitzavim", "נצבים", 8],
  ["Ha'Azinu", "האזינו", 4],
  ["V'Zot HaBerachah", "וזאת הברכה", 7],
];

function parashaFromSeed(workSlug: string, [title, he, simanim]: ParashaSeed): Parasha {
  const slug = title.replace(/ /g, "_");
  return {
    title,
    he,
    slug,
    simanim,
    paragraphs: Array.from({ length: simanim }, () => 0),
    apiBase: `${workSlug},_${slug}`,
  };
}

export function defaultTanchumaPrinted(): Parasha[] {
  return TANCHUMA_PRINTED_SEED.map((row) => parashaFromSeed("Midrash_Tanchuma", row));
}

export function defaultTanchumaBuber(): Parasha[] {
  return TANCHUMA_BUBER_SEED.map((row) => parashaFromSeed("Midrash_Tanchuma_Buber", row));
}

function countValue(value: unknown): number {
  if (typeof value === "number") return value;
  if (Array.isArray(value)) return value.reduce<number>((sum, item) => sum + countValue(item), 0);
  return 0;
}

export function rabbahUnits(book: RabbahBook, index?: SefariaIndex | null): NavUnit[] {
  if (index) {
    const fromIndex = unitsFromRabbahIndex(book.slug, index);
    if (fromIndex.length) return fromIndex;
  }
  const units: NavUnit[] = [];
  if (book.petichta) {
    units.push({
      apiRef: `${book.slug},_Petichta`,
      label: "Petichta",
      he: "פתיחתא",
      paragraphCount: 0,
      kind: "petichta",
    });
  }
  for (let i = 1; i <= book.chapters; i += 1) {
    units.push({
      apiRef: `${book.slug}.${i}`,
      label: String(i),
      paragraphCount: 0,
      kind: "chapter",
    });
  }
  return units;
}

export function unitsFromRabbahIndex(slug: string, index: SefariaIndex): NavUnit[] {
  const schema = index.schema;
  if (schema.nodes?.length) {
    const units: NavUnit[] = [];
    for (const node of schema.nodes) {
      if (node.title === "Petichta" || node.key === "Petichta") {
        units.push({
          apiRef: `${slug},_Petichta`,
          label: "Petichta",
          he: node.heTitle || "פתיחתא",
          paragraphCount: countValue(node.content_counts),
          kind: "petichta",
        });
        continue;
      }
      const cc = node.content_counts;
      if (Array.isArray(cc)) {
        cc.forEach((count, i) => {
          const n = countValue(count);
          if (!n) return;
          units.push({
            apiRef: `${slug}.${i + 1}`,
            label: String(i + 1),
            paragraphCount: n,
            kind: "chapter",
          });
        });
      }
    }
    return units;
  }
  const cc = schema.content_counts;
  if (Array.isArray(cc)) {
    return cc.map((count, i) => ({
      apiRef: `${slug}.${i + 1}`,
      label: String(i + 1),
      paragraphCount: countValue(count),
      kind: "chapter" as const,
    }));
  }
  return [];
}

export function parashotFromTanchumaIndex(workSlug: string, index: SefariaIndex): Parasha[] {
  const nodes = index.schema.nodes ?? [];
  if (!nodes.length) return [];
  return nodes.map((node) => nodeToParasha(workSlug, node));
}

function nodeToParasha(workSlug: string, node: SefariaIndexNode): Parasha {
  const title = node.title || node.key || "";
  const slug = title.replace(/ /g, "_");
  const cc = node.content_counts;
  const paragraphs = Array.isArray(cc)
    ? cc.map((item) => (typeof item === "number" ? item : countValue(item)))
    : typeof cc === "number"
      ? [cc]
      : [];
  return {
    title,
    he: node.heTitle || "",
    slug,
    simanim: paragraphs.length || (typeof cc === "number" ? cc : 0),
    paragraphs,
    apiBase: `${workSlug},_${slug}`,
  };
}

export function tanchumaSimanUnits(parasha: Parasha): NavUnit[] {
  const count = Math.max(parasha.simanim, 1);
  return Array.from({ length: count }, (_, i) => ({
    apiRef: `${parasha.apiBase}.${i + 1}`,
    label: String(i + 1),
    paragraphCount: parasha.paragraphs[i] ?? 0,
    kind: "siman" as const,
  }));
}

export function rabbahBookBySlug(slug: string): RabbahBook | undefined {
  return RABBAH_BOOKS.find((book) => book.slug === slug);
}

export function bookSlugFromApiRef(apiRef: string): string {
  if (apiRef.startsWith("Midrash_Tanchuma_Buber")) return "Midrash_Tanchuma_Buber";
  if (apiRef.startsWith("Midrash_Tanchuma")) return "Midrash_Tanchuma";
  const comma = apiRef.indexOf(",_");
  if (comma !== -1) return apiRef.slice(0, comma);
  const dot = apiRef.indexOf(".");
  return dot === -1 ? apiRef : apiRef.slice(0, dot);
}
