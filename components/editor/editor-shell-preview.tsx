"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorShellPreview() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
        centerContent={
          <p className="text-2xl font-medium tracking-tight text-copy-secondary">
            Canvas coming soon.
          </p>
        }
        rightContent={
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-10 w-10 ring-1 ring-surface-border",
                userButtonTrigger:
                  "rounded-full transition-colors hover:bg-subtle focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-0",
                userButtonPopoverCard:
                  "border border-surface-border bg-surface text-copy-primary",
                userButtonPopoverActionButton:
                  "text-copy-primary hover:bg-subtle",
                userButtonPopoverActionButtonText: "text-copy-primary",
                userButtonPopoverFooter: "border-t border-surface-border",
              },
            }}
          />
        }
      />

      <main className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="absolute inset-0 bg-base" />

        <div className="relative min-h-[calc(100vh-4rem)]" />
      </main>
    </div>
  )
}
