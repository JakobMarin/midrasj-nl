import { htmlToPlain } from "./html";
import type { TranslatorSettings } from "./types";

export const SYSTEM_PROMPT =
  "Je vertaalt rabbijnse midrash van Engels naar verzorgd Nederlands. Behoud rabbijnse namen, Bijbelcitaten en uitleggende toon. Geen extra commentaar. Alleen de vertaling.";

const NEED_KEY =
  "Automatische vertaling is hier niet beschikbaar. Voeg in Instellingen een eigen chat-API-sleutel toe.";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateWithChrome(text: string): Promise<string | null> {
  try {
    const factory = window.Translator;
    if (!factory) return null;
    const availability = await factory.availability({
      sourceLanguage: "en",
      targetLanguage: "nl",
    });
    if (availability === "unavailable") return null;
    const translator = await factory.create({
      sourceLanguage: "en",
      targetLanguage: "nl",
    });
    const out = await translator.translate(text);
    return out?.trim() ? out.trim() : null;
  } catch {
    return null;
  }
}

function chunkText(text: string, max = 450): string[] {
  if (text.length <= max) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > max) {
    let cut = rest.lastIndexOf(" ", max);
    if (cut < max * 0.4) cut = max;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

async function translateWithMyMemory(text: string): Promise<string | null> {
  const chunks = chunkText(text);
  const out: string[] = [];
  for (const chunk of chunks) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|nl`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      responseStatus?: number;
      responseData?: { translatedText?: string };
    };
    const piece = data.responseData?.translatedText?.trim();
    if (!piece || data.responseStatus !== 200) return null;
    if (/^\s*MYMEMORY WARNING/i.test(piece)) return null;
    out.push(piece);
    if (chunks.length > 1) await sleep(200);
  }
  const joined = out.join(" ").trim();
  return joined || null;
}

async function translateWithChat(text: string, settings: TranslatorSettings): Promise<string> {
  if (!settings.apiKey.trim()) {
    throw new Error("Geen API-sleutel ingesteld. Open Instellingen om een sleutel te bewaren.");
  }
  const base = settings.apiBase.replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Chat-API gaf ${res.status}${body ? `: ${body.slice(0, 180)}` : ""}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("De chat-API gaf een lege vertaling terug.");
  return content;
}

export async function translateEnglish(
  englishHtml: string,
  settings: TranslatorSettings,
): Promise<{ nl: string; source: "machine" | "chat" }> {
  const plain = htmlToPlain(englishHtml);
  if (!plain) {
    throw new Error("Deze alinea heeft geen Engelse tekst om te vertalen.");
  }

  if (settings.engine === "chat") {
    const nl = await translateWithChat(plain, settings);
    return { nl, source: "chat" };
  }

  const chrome = await translateWithChrome(plain);
  if (chrome) return { nl: chrome, source: "machine" };

  const machine = await translateWithMyMemory(plain);
  if (machine) return { nl: machine, source: "machine" };

  throw new Error(NEED_KEY);
}

export { NEED_KEY };
