"use client"

import { useMemo, useState } from "react"

export interface MockProject {
  id: string
  name: string
  slug: string
  access: "owner" | "collaborator"
}

export type ProjectDialogMode = "create" | "rename" | "delete" | null

const DEFAULT_SLUG_PREVIEW = "your-project-name"

const INITIAL_PROJECTS: MockProject[] = [
  {
    id: "project-checkout-modernization",
    name: "Checkout Modernization",
    slug: "checkout-modernization",
    access: "owner",
  },
  {
    id: "project-data-platform-refresh",
    name: "Data Platform Refresh",
    slug: "data-platform-refresh",
    access: "owner",
  },
  {
    id: "project-billing-observability",
    name: "Billing Observability",
    slug: "billing-observability",
    access: "collaborator",
  },
]

function slugifyProjectName(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

  return slug || DEFAULT_SLUG_PREVIEW
}

export function useProjectDialogState() {
  const [projects, setProjects] = useState<MockProject[]>(INITIAL_PROJECTS)
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode>(null)
  const [draftName, setDraftName] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  )

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.access === "owner"),
    [projects]
  )

  const sharedProjects = useMemo(
    () => projects.filter((project) => project.access === "collaborator"),
    [projects]
  )

  const slugPreview = useMemo(() => slugifyProjectName(draftName), [draftName])
  const isNameValid = draftName.trim().length > 0

  function closeDialog() {
    if (isLoading) {
      return
    }

    setDialogMode(null)
    setDraftName("")
    setSelectedProjectId(null)
  }

  function openCreateDialog() {
    setDialogMode("create")
    setDraftName("")
    setSelectedProjectId(null)
  }

  function openRenameDialog(project: MockProject) {
    setDialogMode("rename")
    setDraftName(project.name)
    setSelectedProjectId(project.id)
  }

  function openDeleteDialog(project: MockProject) {
    setDialogMode("delete")
    setDraftName(project.name)
    setSelectedProjectId(project.id)
  }

  async function submitCreateProject() {
    if (!isNameValid) {
      return
    }

    setIsLoading(true)

    const name = draftName.trim()
    const slug = slugifyProjectName(name)

    setProjects((currentProjects) => [
      {
        id: `project-${slug}`,
        name,
        slug,
        access: "owner",
      },
      ...currentProjects,
    ])

    setIsLoading(false)
    closeDialog()
  }

  async function submitRenameProject() {
    if (!selectedProject || !isNameValid) {
      return
    }

    setIsLoading(true)

    const name = draftName.trim()
    const slug = slugifyProjectName(name)

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              name,
              slug,
            }
          : project
      )
    )

    setIsLoading(false)
    closeDialog()
  }

  async function submitDeleteProject() {
    if (!selectedProject) {
      return
    }

    setIsLoading(true)

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== selectedProject.id)
    )

    setIsLoading(false)
    closeDialog()
  }

  return {
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
  }
}
