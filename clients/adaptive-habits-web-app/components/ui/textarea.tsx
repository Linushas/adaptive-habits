import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-transparent placeholder:text-muted-foreground focus-visible:ring-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-bg-light-2 flex field-sizing-content min-h-16 w-full rounded-md border bg-bg-light-2 px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-none focus-visible:border focus-visible:border-fg-muted/60 disabled:cursor-not-allowed disabled:opacity-50 text-fg md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
