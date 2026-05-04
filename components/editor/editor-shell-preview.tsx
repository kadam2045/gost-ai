"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Plus } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { useProjectDialogState } from "@/components/editor/project-dialog-state"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"

export function EditorShellPreview() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const {
    dialogMode,
    draftName,
    isLoading,
    ownedProjects,
    selectedProject,
    setDraftName,
    sharedProjects,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  } = useProjectDialogState()

  return (
    <div className="flex min-h-screen flex-col bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
        centerContent={
          <p className="text-lg font-semibold tracking-tight text-copy-primary">
            Editor Home
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
        {isSidebarOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-30 bg-base/70 md:hidden"
            aria-label="Close projects sidebar"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <ProjectSidebar
          isOpen={isSidebarOpen}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onClose={() => setIsSidebarOpen(false)}
          onNewProject={openCreateDialog}
          onRenameProject={openRenameDialog}
          onDeleteProject={openDeleteDialog}
        />

        <div className="absolute inset-0 bg-base" />

        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
          <div className="w-full max-w-3xl space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-copy-primary sm:text-6xl">
                Create a project or open an existing one
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-copy-muted sm:text-lg">
                Start a new architecture workspace, or choose a project from the sidebar.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-2xl px-5 text-base"
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </main>

      <ProjectDialogs
        dialogMode={dialogMode}
        draftName={draftName}
        isLoading={isLoading}
        selectedProject={selectedProject}
        slugPreview={slugPreview}
        onClose={closeDialog}
        onDraftNameChange={setDraftName}
        onCreateSubmit={submitCreateProject}
        onRenameSubmit={submitRenameProject}
        onDeleteSubmit={submitDeleteProject}
      />
    </div>
  )
}
