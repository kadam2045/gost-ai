"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { MockProject } from "@/components/editor/project-dialog-state"

interface ProjectSidebarProps {
  className?: string
  isOpen: boolean
  ownedProjects?: MockProject[]
  sharedProjects?: MockProject[]
  onClose?: () => void
  onNewProject?: () => void
  onRenameProject?: (project: MockProject) => void
  onDeleteProject?: (project: MockProject) => void
}

function EmptyProjectsState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-border bg-base/40 p-4">
      <div className="space-y-2">
        <p className="text-base font-medium text-copy-secondary">
          {title}
        </p>
        {description ? (
          <p className="text-sm leading-6 text-copy-muted">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

function ProjectList({
  projects,
  showOwnedActions,
  onRenameProject,
  onDeleteProject,
}: {
  projects: MockProject[]
  showOwnedActions: boolean
  onRenameProject?: (project: MockProject) => void
  onDeleteProject?: (project: MockProject) => void
}) {
  if (projects.length === 0) {
    return (
      <EmptyProjectsState
        title={
          showOwnedActions
            ? "You have not created any projects yet."
            : "No shared projects yet."
        }
        description=""
      />
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group flex items-center gap-3 rounded-[1.75rem] border border-surface-border bg-subtle px-5 py-4"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-copy-primary">
              {project.name}
            </p>
            <p className="truncate text-xs uppercase tracking-[0.18em] text-copy-faint">
              {project.slug}
            </p>
          </div>

          {showOwnedActions ? (
            <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-xl text-copy-secondary hover:bg-surface hover:text-copy-primary"
                onClick={() => onRenameProject?.(project)}
                aria-label={`Rename ${project.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-xl text-copy-secondary hover:bg-surface hover:text-destructive"
                onClick={() => onDeleteProject?.(project)}
                aria-label={`Delete ${project.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ProjectSidebar({
  className,
  isOpen,
  ownedProjects = [],
  sharedProjects = [],
  onClose,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 z-40 w-full max-w-[27rem] border-r border-surface-border bg-surface transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
        className
      )}
      aria-hidden={!isOpen}
    >
      <div className="pointer-events-auto flex h-full flex-col">
        <div className="flex items-start justify-between border-b border-surface-border px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
              Projects
            </p>
            <p className="mt-3 max-w-[16rem] text-sm leading-7 text-copy-muted">
              Create a project or jump into an existing room.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-xl text-copy-secondary hover:bg-subtle hover:text-copy-primary"
            onClick={onClose}
            aria-label="Close projects sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col px-5 py-5">
          <Button
            type="button"
            className="h-12 w-full rounded-2xl text-base"
            onClick={onNewProject}
          >
            <Plus className="h-4 w-4" />
            Create project
          </Button>

          <Tabs
            defaultValue="my-projects"
            className="mt-5 flex min-h-0 flex-1 flex-col gap-4"
          >
            <TabsList className="grid h-14 w-full grid-cols-2 rounded-2xl bg-subtle p-1">
            <TabsTrigger value="my-projects" className="rounded-xl text-base">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="rounded-xl text-base">
              Shared
            </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="min-h-0 flex-1 outline-none">
              <ProjectList
                projects={ownedProjects}
                showOwnedActions
                onRenameProject={onRenameProject}
                onDeleteProject={onDeleteProject}
              />
            </TabsContent>

            <TabsContent value="shared" className="min-h-0 flex-1 outline-none">
              <ProjectList
                projects={sharedProjects}
                showOwnedActions={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </aside>
  )
}
