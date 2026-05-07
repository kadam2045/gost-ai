import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createUnauthorizedResponse,
  createForbiddenResponse,
  createNotFoundResponse,
} from "@/lib/project-api";
import { requireProjectOwner } from "@/lib/project-access";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; collaboratorId: string }> },
) {
  const { projectId, collaboratorId } = await params;
  const ownership = await requireProjectOwner(projectId);

  if (ownership.status === "unauthorized") return createUnauthorizedResponse();
  if (ownership.status === "forbidden") return createForbiddenResponse();
  if (ownership.status === "not-found") return createNotFoundResponse();

  // Check if collaborator exists and belongs to this project
  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { id: collaboratorId },
    select: { projectId: true },
  });

  if (!collaborator || collaborator.projectId !== projectId) {
    return NextResponse.json(
      { error: "Collaborator not found in this project" },
      { status: 404 },
    );
  }

  // Delete collaborator
  await prisma.projectCollaborator.delete({
    where: { id: collaboratorId },
  });

  return new NextResponse(null, { status: 204 });
}
