import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground text-fg placeholder:text-fg-muted selection:bg-fg-muted selection:text-bg-light dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-destructive ring-none border-none focus:border-fg-muted/60 focus:ring-fg-muted/60 focus:ring-1 bg-bg-light-2",
        className
      )}
      {...props}
    />
  )
}

export { Input }
