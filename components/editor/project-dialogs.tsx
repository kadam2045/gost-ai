"use client"

import {
  EditorDialog,
  EditorDialogClose,
  EditorDialogShell,
  EditorDialogShellBody,
  EditorDialogShellFooter,
  EditorDialogShellHeader,
} from "@/components/editor/editor-dialog-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { ProjectResponse } from "@/lib/project-api"
import type { ProjectDialogMode } from "@/hooks/use-project-actions"

interface ProjectDialogsProps {
  dialogMode: ProjectDialogMode
  draftName: string
  isLoading: boolean
  selectedProject: ProjectResponse | null
  slugPreview: string
  onClose: () => void
  onDraftNameChange: (value: string) => void
  onCreateSubmit: () => void
  onRenameSubmit: () => void
  onDeleteSubmit: () => void
}

export function ProjectDialogs({
  dialogMode,
  draftName,
  isLoading,
  selectedProject,
  slugPreview,
  onClose,
  onDraftNameChange,
  onCreateSubmit,
  onRenameSubmit,
  onDeleteSubmit,
}: ProjectDialogsProps) {
  const editorPathPreview = `/editor/${slugPreview}`

  return (
    <>
      <EditorDialog open={dialogMode === "create"} onOpenChange={(open) => (!open ? onClose() : undefined)}>
        <EditorDialogShell className="max-w-2xl">
          <EditorDialogShellHeader
            title="Create project"
            description="Enter a project name to create a new room."
          />
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void onCreateSubmit()
            }}
          >
            <EditorDialogShellBody className="space-y-4">
              <div className="space-y-3">
                <Input
                  id="project-name-create"
                  value={draftName}
                  onChange={(event) => onDraftNameChange(event.target.value)}
                  placeholder="Realtime architecture map"
                  autoFocus
                  className="h-14 rounded-2xl border-surface-border bg-base px-5 text-lg text-copy-primary placeholder:text-copy-faint focus-visible:ring-brand/40"
                />
              </div>

              <div className="rounded-2xl border border-surface-border bg-base px-5 py-3 text-base text-copy-muted">
                {editorPathPreview}
              </div>
            </EditorDialogShellBody>

            <EditorDialogShellFooter>
              <EditorDialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-surface-border bg-transparent px-4 text-copy-secondary hover:bg-subtle hover:text-copy-primary"
                  />
                }
              >
                Cancel
              </EditorDialogClose>
              <Button
                type="submit"
                disabled={isLoading || draftName.trim().length === 0}
                className="h-11 rounded-xl px-5"
              >
                {isLoading ? "Creating..." : "Create project"}
              </Button>
            </EditorDialogShellFooter>
          </form>
        </EditorDialogShell>
      </EditorDialog>

      <EditorDialog open={dialogMode === "rename"} onOpenChange={(open) => (!open ? onClose() : undefined)}>
        <EditorDialogShell className="max-w-2xl">
          <EditorDialogShellHeader
            title="Rename Project"
            description={
              selectedProject
                ? `Current project name: ${selectedProject.name}`
                : undefined
            }
          />
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void onRenameSubmit()
            }}
          >
            <EditorDialogShellBody className="space-y-2">
              <label
                htmlFor="project-name-rename"
                className="text-sm font-medium text-copy-secondary"
              >
                Project name
              </label>
              <Input
                id="project-name-rename"
                value={draftName}
                onChange={(event) => onDraftNameChange(event.target.value)}
                autoFocus
                className="h-14 rounded-2xl border-surface-border bg-base px-5 text-lg text-copy-primary focus-visible:ring-brand/40"
              />
            </EditorDialogShellBody>

            <EditorDialogShellFooter>
              <EditorDialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-surface-border bg-transparent px-4 text-copy-secondary hover:bg-subtle hover:text-copy-primary"
                  />
                }
              >
                Cancel
              </EditorDialogClose>
              <Button
                type="submit"
                disabled={isLoading || draftName.trim().length === 0}
                className="h-11 rounded-xl px-4"
              >
                {isLoading ? "Saving..." : "Save Name"}
              </Button>
            </EditorDialogShellFooter>
          </form>
        </EditorDialogShell>
      </EditorDialog>

      <EditorDialog open={dialogMode === "delete"} onOpenChange={(open) => (!open ? onClose() : undefined)}>
        <EditorDialogShell className="max-w-2xl">
          <EditorDialogShellHeader
            title="Delete Project"
            description={
              selectedProject
                ? `This will permanently remove ${selectedProject.name} and all its design data.`
                : "This action cannot be undone."
            }
          />
          <EditorDialogShellBody>
            <p className="text-sm leading-6 text-copy-secondary">
              This is a destructive confirmation only. No additional input is required.
            </p>
          </EditorDialogShellBody>
          <EditorDialogShellFooter>
            <EditorDialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-surface-border bg-transparent px-4 text-copy-secondary hover:bg-subtle hover:text-copy-primary"
                />
              }
            >
              Cancel
            </EditorDialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={() => {
                void onDeleteSubmit()
              }}
              className="h-11 rounded-xl px-4"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </Button>
          </EditorDialogShellFooter>
        </EditorDialogShell>
      </EditorDialog>
    </>
  )
}
