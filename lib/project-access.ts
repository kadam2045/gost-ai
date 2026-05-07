import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { projectResponseSelect, type ProjectResponse } from "@/lib/project-api";

export interface ProjectWithAccess extends ProjectResponse {
  collaborators: { email: string }[];
}

export type AccessResult =
  | { status: "unauthorized" }
  | { status: "not-found" }
  | { status: "forbidden" }
  | { status: "granted"; project: ProjectWithAccess };

/**
 * Verifies if the current user has access to a project.
 * Returns the project data if access is granted (owner or collaborator).
 */
export async function getProjectAccess(
  projectId: string,
): Promise<AccessResult> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return { status: "unauthorized" };
  }

  const email = user?.emailAddresses[0]?.emailAddress;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ...projectResponseSelect,
      collaborators: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!project) {
    return { status: "not-found" };
  }

  const isOwner = project.ownerId === userId;
  const isCollaborator = email
    ? project.collaborators.some((c) => c.email === email)
    : false;

  if (!isOwner && !isCollaborator) {
    return { status: "forbidden" };
  }

  return { status: "granted", project: project as ProjectWithAccess };
}

/**
 * Returns the current user's identity details for project access checks.
 */
export async function getUserIdentity() {
  const { userId } = await auth();
  const user = await currentUser();

  return {
    userId,
    email: user?.emailAddresses[0]?.emailAddress,
  };
}

/**
 * Enforces that the current user is the owner of the project.
 */
export async function requireProjectOwner(projectId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { status: "unauthorized" } as const;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return { status: "not-found" } as const;
  }

  if (project.ownerId !== userId) {
    return { status: "forbidden" } as const;
  }

  return { status: "success", userId } as const;
}
