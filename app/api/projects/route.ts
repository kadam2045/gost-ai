import { NextResponse } from "next/server";

import {
  createUnauthorizedResponse,
  parseProjectPayload,
  projectResponseSelect,
  requireAuthenticatedUserId,
} from "@/lib/project-api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return createUnauthorizedResponse();
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: projectResponseSelect,
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const userId = await requireAuthenticatedUserId();

  if (!userId) {
    return createUnauthorizedResponse();
  }

  const payload = await parseProjectPayload(request, { defaultName: true });

  if ("error" in payload) {
    return payload.error;
  }

  const project = await prisma.project.create({
    data: {
      id: payload.data.id,
      ownerId: userId,
      name: payload.data.name,
    },
    select: projectResponseSelect,
  });

  return NextResponse.json({ project }, { status: 201 });
}
