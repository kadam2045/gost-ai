import type { ReactNode } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface EditorDialogShellProps {
  children: ReactNode
  className?: string
}

function EditorDialogShell({ children, className }: EditorDialogShellProps) {
  return (
    <DialogContent
      className={cn(
        "max-w-xl gap-0 rounded-3xl border border-surface-border bg-elevated p-0 text-copy-primary ring-0",
        className
      )}
    >
      {children}
    </DialogContent>
  )
}

function EditorDialogShellHeader({
  title,
  description,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    <DialogHeader className={cn("gap-2 border-b border-surface-border px-6 py-5", className)}>
      <DialogTitle className="text-lg font-semibold text-copy-primary">
        {title}
      </DialogTitle>
      {description ? (
        <DialogDescription className="text-sm leading-6 text-copy-muted">
          {description}
        </DialogDescription>
      ) : null}
    </DialogHeader>
  )
}

function EditorDialogShellBody({
  children,
  className,
}: EditorDialogShellProps) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>
}

function EditorDialogShellFooter({
  children,
  className,
}: EditorDialogShellProps) {
  return (
    <DialogFooter
      className={cn(
        "mx-0 mb-0 rounded-b-3xl border-surface-border bg-surface px-6 py-4",
        className
      )}
    >
      {children}
    </DialogFooter>
  )
}

export {
  Dialog as EditorDialog,
  DialogClose as EditorDialogClose,
  EditorDialogShell,
  EditorDialogShellBody,
  EditorDialogShellFooter,
  EditorDialogShellHeader,
  DialogTrigger as EditorDialogTrigger,
}
