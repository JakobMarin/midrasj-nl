import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TranslatorSettings } from "@/lib/midrash/types";

type Props = {
  open: boolean;
  settings: TranslatorSettings;
  onOpenChange: (open: boolean) => void;
  onSave: (next: TranslatorSettings) => void;
};

export function SettingsDialog({ open, settings, onOpenChange, onSave }: Props) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Instellingen</DialogTitle>
          <DialogDescription>
            Kies hoe ontbrekende alinea’s naar het Nederlands worden gezet. De
            API-sleutel blijft in deze browser (localStorage) en gaat nooit naar
            een eigen server van Midrasj NL.
          </DialogDescription>
        </DialogHeader>

        <fieldset className="space-y-3">
          <legend className="font-sans text-sm font-medium">Vertaalengine</legend>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-cream/60 p-3">
            <input
              type="radio"
              name="engine"
              className="mt-1 accent-bordeaux"
              checked={draft.engine === "auto"}
              onChange={() => setDraft({ ...draft, engine: "auto" })}
            />
            <span>
              <span className="block font-medium">Automatisch (machineconcept)</span>
              <span className="mt-0.5 block text-sm text-muted">
                Eerst de ingebouwde vertaler van Chrome/Edge (
                <code className="font-sans text-xs">window.Translator</code>
                ), daarna een machinevertaling Engels→Nederlands. Anders volgt
                een verzoek om een sleutel.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-cream/60 p-3">
            <input
              type="radio"
              name="engine"
              className="mt-1 accent-bordeaux"
              checked={draft.engine === "chat"}
              onChange={() => setDraft({ ...draft, engine: "chat" })}
            />
            <span>
              <span className="block font-medium">Eigen chat-API</span>
              <span className="mt-0.5 block text-sm text-muted">
                OpenAI-compatibel eindpunt. Alleen de gevraagde alinea, met de
                vaste systeemprompt voor rabbijnse midrasj.
              </span>
            </span>
          </label>
        </fieldset>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="api-base">API-basis-URL</Label>
            <Input
              id="api-base"
              value={draft.apiBase}
              onChange={(e) => setDraft({ ...draft, apiBase: e.target.value })}
              placeholder="https://api.openai.com/v1"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="api-model">Modelnaam</Label>
            <Input
              id="api-model"
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              placeholder="gpt-4o-mini"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="api-key">API-sleutel</Label>
            <Input
              id="api-key"
              type="password"
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              placeholder="alleen lokaal bewaard"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Annuleer
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            Bewaar instellingen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
