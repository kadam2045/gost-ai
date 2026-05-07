import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";

export interface ProjectPayload {
  name: string;
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function createForbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function createNotFoundResponse() {
  return NextResponse.json({ error: "Project not found" }, { status: 404 });
}

export function createInvalidJsonResponse() {
  return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
}

export function createInvalidNameResponse() {
  return NextResponse.json(
    { error: "Project name must be a non-empty string." },
    { status: 400 },
  );
}

export async function requireAuthenticatedUserId() {
  const { userId } = await auth();

  return userId;
}

export async function parseProjectPayload(
  request: Request,
  options: { defaultName: boolean },
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { error: createInvalidJsonResponse() } as const;
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: createInvalidNameResponse() } as const;
  }

  const { name, id } = body as { name?: unknown; id?: unknown };

  if (name === undefined && options.defaultName) {
    return {
      data: {
        name: DEFAULT_PROJECT_NAME,
        id: typeof id === "string" ? id : undefined,
      },
    } as const;
  }

  if (typeof name !== "string") {
    return { error: createInvalidNameResponse() } as const;
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return { error: createInvalidNameResponse() } as const;
  }

  return {
    data: {
      name: trimmedName,
      id: typeof id === "string" ? id : undefined,
    },
  } as const;
}

export async function getOwnedProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      ownerId: true,
    },
  });
}

export const projectResponseSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  status: true,
  canvasJsonPath: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ProjectResponse = {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ARCHIVED";
  canvasJsonPath: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getProjectsForUser(userId: string, email?: string) {
  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: projectResponseSelect,
    }),
    email
      ? prisma.project.findMany({
          where: {
            collaborators: {
              some: { email },
            },
          },
          orderBy: { updatedAt: "desc" },
          select: projectResponseSelect,
        })
      : Promise.resolve([]),
  ]);

  return { ownedProjects, sharedProjects };
}
