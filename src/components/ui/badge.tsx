import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 font-sans text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        missing: "border-border bg-cream text-muted",
        concept: "border-amber-800/20 bg-amber-50 text-amber-900",
        reviewed: "border-emerald-900/20 bg-emerald-50 text-emerald-900",
        seed: "border-navy/20 bg-navy/8 text-navy",
        chip: "border-border bg-paper text-ink",
        license: "border-bordeaux/20 bg-bordeaux/8 text-bordeaux",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
