"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  className?: string
  isOpen: boolean
  onClose?: () => void
  onNewProject?: () => void
}

function EmptyProjectsState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center p-6 text-center">
      <div className="space-y-2">
        <p className="text-2xl font-medium tracking-tight text-copy-secondary">
          {title}
        </p>
        {description ? (
          <p className="text-sm leading-6 text-copy-muted">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectSidebar({
  className,
  isOpen,
  onClose,
  onNewProject,
}: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 z-40 w-[28rem] border-r border-surface-border bg-surface transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
        className
      )}
      aria-hidden={!isOpen}
    >
      <div className="pointer-events-auto flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">
          <div>
            <h2 className="text-[2rem] font-semibold tracking-tight text-copy-primary">
              Projects
            </h2>
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

        <Tabs
          defaultValue="my-projects"
          className="min-h-0 flex-1 gap-5 px-4 py-4"
        >
          <TabsList className="grid h-14 w-full grid-cols-2 rounded-2xl bg-subtle p-1">
            <TabsTrigger value="my-projects" className="rounded-xl text-base">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="rounded-xl text-base">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="min-h-0 flex-1">
            <EmptyProjectsState
              title="No projects yet."
              description=""
            />
          </TabsContent>

          <TabsContent value="shared" className="min-h-0 flex-1">
            <EmptyProjectsState
              title="Nothing shared yet."
              description=""
            />
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-5">
          <Button
            type="button"
            className="h-14 w-full rounded-2xl text-lg"
            onClick={onNewProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </aside>
  )
}
