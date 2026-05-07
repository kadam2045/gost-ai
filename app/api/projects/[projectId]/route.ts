import { NextResponse } from "next/server";

import {
  createForbiddenResponse,
  createNotFoundResponse,
  createUnauthorizedResponse,
  getOwnedProject,
  parseProjectPayload,
  projectResponseSelect,
  requireAuthenticatedUserId,
} from "@/lib/project-api";
import { prisma } from "@/lib/prisma";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: ProjectRouteContext,
) {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return createUnauthorizedResponse();
  }

  const { projectId } = await context.params;
  const existingProject = await getOwnedProject(projectId);

  if (!existingProject) {
    return createNotFoundResponse();
  }

  if (existingProject.ownerId !== userId) {
    return createForbiddenResponse();
  }

  const payload = await parseProjectPayload(request, { defaultName: false });

  if ("error" in payload) {
    return payload.error;
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: payload.data.name,
    },
    select: projectResponseSelect,
  });

  return NextResponse.json({ project });
}

export async function DELETE(
  _request: Request,
  context: ProjectRouteContext,
) {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return createUnauthorizedResponse();
  }

  const { projectId } = await context.params;
  const existingProject = await getOwnedProject(projectId);

  if (!existingProject) {
    return createNotFoundResponse();
  }

  if (existingProject.ownerId !== userId) {
    return createForbiddenResponse();
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return NextResponse.json({ deletedProjectId: projectId });
}
