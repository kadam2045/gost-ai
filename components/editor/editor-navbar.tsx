"use client"

import type { ReactNode } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  className?: string
  isSidebarOpen: boolean
  onSidebarToggle?: () => void
  centerContent?: ReactNode
  rightContent?: ReactNode
}

export function EditorNavbar({
  className,
  isSidebarOpen,
  onSidebarToggle,
  centerContent,
  rightContent,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-surface-border bg-surface px-4",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        {centerContent}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        {rightContent}
      </div>
    </header>
  )
}
