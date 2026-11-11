export type SegmentStatus = "concept" | "reviewed" | "seed";

export type CorpusSegment = {
  nl: string;
  status: SegmentStatus;
  source: "seed" | "machine" | "chat" | "manual";
  updated: string;
  version?: string;
};

export type Corpus = {
  segments: Record<string, CorpusSegment>;
};

export type Engine = "auto" | "chat";

export type TranslatorSettings = {
  engine: Engine;
  apiBase: string;
  model: string;
  apiKey: string;
};

export type SefariaIndexNode = {
  title?: string;
  heTitle?: string;
  key?: string;
  default?: boolean;
  depth?: number;
  addressTypes?: string[];
  sectionNames?: string[];
  content_counts?: unknown;
  nodes?: SefariaIndexNode[];
  nodeType?: string;
};

export type SefariaIndex = {
  title: string;
  heTitle?: string;
  schema: SefariaIndexNode & {
    nodes?: SefariaIndexNode[];
    content_counts?: unknown;
    length?: number;
    depth?: number;
  };
};

export type SefariaText = {
  ref: string;
  heRef: string;
  text: unknown;
  he: unknown;
  next: string | null;
  prev: string | null;
  versionTitle: string;
  heVersionTitle?: string;
  license: string;
  indexTitle?: string;
};

export type NavUnit = {
  apiRef: string;
  label: string;
  he?: string;
  paragraphCount: number;
  kind: "chapter" | "petichta" | "siman";
};

export type RabbahBook = {
  slug: string;
  title: string;
  dutch: string;
  he: string;
  chapters: number;
  petichta?: boolean;
};

export type Parasha = {
  title: string;
  he: string;
  slug: string;
  simanim: number;
  paragraphs: number[];
  apiBase: string;
};

export type WorkKind = "rabbah" | "tanchuma" | "tanchuma-buber";

export type ReaderSegment = {
  ref: string;
  en: string;
  he: string;
  group?: string;
};
