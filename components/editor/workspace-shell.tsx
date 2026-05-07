"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Share2, Sparkles, MessageSquare } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Button } from "@/components/ui/button";
import type { ProjectResponse } from "@/lib/project-api";
import { cn } from "@/lib/utils";

interface WorkspaceShellProps {
  project: ProjectResponse;
  ownedProjects: ProjectResponse[];
  sharedProjects: ProjectResponse[];
  currentUserId: string;
}

export function WorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
  currentUserId,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const {
    dialogMode,
    draftName,
    isLoading,
    selectedProject,
    setDraftName,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  } = useProjectActions();

  return (
    <div className="flex h-screen flex-col bg-base text-copy-primary overflow-hidden">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        centerContent={
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate text-lg font-semibold tracking-tight text-copy-primary">
              {project.name}
            </span>
            <span className="hidden rounded-lg bg-subtle px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-copy-faint ring-1 ring-surface-border sm:inline-block">
              Project
            </span>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden h-9 gap-2 rounded-xl px-4 text-sm sm:flex"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-xl transition-colors",
                isAiSidebarOpen
                  ? "bg-accent-dim text-brand"
                  : "text-copy-secondary hover:bg-subtle hover:text-copy-primary",
              )}
              onClick={() => setIsAiSidebarOpen((prev) => !prev)}
            >
              <Sparkles className="h-5 w-5" />
            </Button>
            <div className="h-6 w-px bg-surface-border mx-1" />
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9 ring-1 ring-surface-border",
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
          </div>
        }
      />

      <main className="relative flex flex-1 overflow-hidden">
        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-30 bg-base/70 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <ProjectSidebar
          isOpen={isSidebarOpen}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
          onClose={() => setIsSidebarOpen(false)}
          onNewProject={openCreateDialog}
          onRenameProject={openRenameDialog}
          onDeleteProject={openDeleteDialog}
        />

        {/* Central Canvas Area */}
        <div className="relative flex-1 bg-base">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-subtle ring-1 ring-surface-border">
                <MessageSquare className="h-8 w-8 text-copy-muted" />
              </div>
              <div className="space-y-2 px-6">
                <h2 className="text-xl font-semibold">Canvas is empty</h2>
                <p className="text-sm leading-6 text-copy-muted">
                  The real-time collaborative canvas will live here. Use the AI
                  sidebar to generate your first architecture.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right AI Sidebar Placeholder */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-40 w-full max-w-[24rem] border-l border-surface-border bg-surface transition-transform duration-300 md:relative md:translate-x-0",
            isAiSidebarOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
                  AI Assistant
                </p>
                <p className="mt-3 text-sm leading-7 text-copy-muted">
                  Generate architectures from natural language prompts.
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center p-10 text-center">
              <div className="space-y-4">
                <Sparkles className="mx-auto h-8 w-8 text-copy-faint" />
                <p className="text-sm leading-relaxed text-copy-muted">
                  The AI generation workflow will be implemented here in a
                  future unit.
                </p>
              </div>
            </div>
          </div>
        </aside>
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

      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        projectId={project.id}
        currentUserId={currentUserId}
      />
    </div>
  );
}
