const FOOTNOTE_SELECTOR = "sup.footnote-marker, i.footnote, sup.footnote, span.footnote";
const ALLOWED_TAGS = new Set(["B", "I", "EM", "BR", "STRONG", "SMALL", "SPAN", "P", "DIV", "BLOCKQUOTE"]);

function decodeEntities(raw: string): string {
  return raw
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCharCode(parseInt(n, 16)));
}

function stripFootnotesRegex(html: string): string {
  return html
    .replace(/<sup class="footnote-marker"[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<i class="footnote"[^>]*>[\s\S]*?<\/i>/gi, "")
    .replace(/<sup class="footnote"[^>]*>[\s\S]*?<\/sup>/gi, "");
}

function sanitizeNode(node: Node): void {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      if (!ALLOWED_TAGS.has(el.tagName)) {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        }
      } else {
        for (const attr of Array.from(el.attributes)) {
          if (attr.name.startsWith("on") || attr.name === "src" || attr.name === "href") {
            el.removeAttribute(attr.name);
          }
        }
        sanitizeNode(el);
      }
    } else if (child.nodeType === Node.COMMENT_NODE) {
      child.parentNode?.removeChild(child);
    }
  }
}

export function sanitizeReadingHtml(html: string): string {
  if (!html) return "";
  if (typeof DOMParser === "undefined") {
    return stripFootnotesRegex(html);
  }
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";
  root.querySelectorAll(FOOTNOTE_SELECTOR).forEach((el) => el.remove());
  sanitizeNode(root);
  return root.innerHTML.trim();
}

export function htmlToPlain(html: string): string {
  const clean = sanitizeReadingHtml(html);
  const withBreaks = clean
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(withBreaks).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function dutchToHtml(text: string): string {
  if (!text) return "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const bold = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const italic = bold.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return italic.replace(/\n/g, "<br />");
}

export function isMostlyEmpty(html: string): boolean {
  return htmlToPlain(html).length < 2;
}
