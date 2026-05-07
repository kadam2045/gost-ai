"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { ProjectResponse } from "@/lib/project-api"

export type ProjectDialogMode = "create" | "rename" | "delete" | null

const DEFAULT_SLUG_PREVIEW = "your-project-name"

function slugifyProjectName(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

  return slug || DEFAULT_SLUG_PREVIEW
}

export function useProjectActions() {
  const router = useRouter()
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode>(null)
  const [draftName, setDraftName] = useState("")
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const slugPreview = useMemo(() => {
    const slug = slugifyProjectName(draftName)
    if (dialogMode === "create") {
      return slug
    }
    return ""
  }, [draftName, dialogMode])

  const isNameValid = draftName.trim().length > 0

  function closeDialog() {
    if (isLoading) {
      return
    }

    setDialogMode(null)
    setDraftName("")
    setSelectedProject(null)
  }

  function openCreateDialog() {
    setDialogMode("create")
    setDraftName("")
    setSelectedProject(null)
  }

  function openRenameDialog(project: ProjectResponse) {
    setDialogMode("rename")
    setDraftName(project.name)
    setSelectedProject(project)
  }

  function openDeleteDialog(project: ProjectResponse) {
    setDialogMode("delete")
    setDraftName(project.name)
    setSelectedProject(project)
  }

  async function submitCreateProject() {
    if (!isNameValid) {
      return
    }

    setIsLoading(true)

    try {
      const name = draftName.trim()
      const slugBase = slugifyProjectName(name)
      const suffix = Math.random().toString(36).substring(2, 6)
      const id = `${slugBase}-${suffix}`

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const { project } = await response.json()
      
      closeDialog()
      router.push(`/editor/${project.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRenameProject() {
    if (!selectedProject || !isNameValid) {
      return
    }

    setIsLoading(true)

    try {
      const name = draftName.trim()

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to rename project")
      }

      closeDialog()
      router.refresh()
    } catch (error) {
      console.error("Error renaming project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDeleteProject() {
    if (!selectedProject) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      closeDialog()
      
      // If we're on the project's page, redirect to editor home
      // Otherwise just refresh
      if (window.location.pathname === `/editor/${selectedProject.id}`) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}
