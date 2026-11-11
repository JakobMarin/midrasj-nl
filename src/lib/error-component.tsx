import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center text-ink">
      <span className="text-bordeaux" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-serif text-2xl">Er ging iets mis</h1>
      <p className="max-w-md font-sans text-sm break-words text-muted">
        {error.message || "Er trad een onverwachte fout op. Probeer de pagina te vernieuwen."}
      </p>
    </main>
  );
}
