import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-paper px-3 font-sans text-sm text-ink shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
