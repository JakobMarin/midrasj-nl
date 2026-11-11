import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full rounded-md border border-border bg-paper px-3 py-2.5 font-serif text-sm leading-relaxed text-ink shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:font-sans placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
