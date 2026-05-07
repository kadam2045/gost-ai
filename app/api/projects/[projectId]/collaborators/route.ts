import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  createUnauthorizedResponse,
  createForbiddenResponse,
  createNotFoundResponse,
} from "@/lib/project-api";
import { requireProjectOwner, getUserIdentity } from "@/lib/project-access";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const { userId, email } = await getUserIdentity();

  if (!userId) return createUnauthorizedResponse();

  // Check if user is owner or collaborator
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      collaborators: {
        select: { email: true },
      },
    },
  });

  if (!project) return createNotFoundResponse();

  const isOwner = project.ownerId === userId;
  const isCollaborator = email
    ? project.collaborators.some((c) => c.email === email)
    : false;

  if (!isOwner && !isCollaborator) return createForbiddenResponse();

  // Fetch collaborators from DB
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Fetch owner details from Clerk
  const client = await clerkClient();
  const ownerUser = await client.users.getUser(project.ownerId);

  // Fetch collaborator details from Clerk
  const emails = collaborators.map((c) => c.email);
  let enrichedCollaborators = collaborators.map((c) => ({
    ...c,
    name: null as string | null,
    imageUrl: null as string | null,
  }));

  if (emails.length > 0) {
    const clerkUsers = await client.users.getUserList({
      emailAddress: emails,
    });

    enrichedCollaborators = collaborators.map((collab) => {
      const clerkUser = clerkUsers.data.find((u) =>
        u.emailAddresses.some((e) => e.emailAddress === collab.email),
      );

      return {
        ...collab,
        name: clerkUser
          ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim()
          : null,
        imageUrl: clerkUser?.imageUrl ?? null,
      };
    });
  }

  return NextResponse.json({
    owner: {
      userId: project.ownerId,
      name:
        `${ownerUser.firstName ?? ""} ${ownerUser.lastName ?? ""}`.trim() ||
        (ownerUser.emailAddresses[0]?.emailAddress ?? "Unknown Owner"),
      imageUrl: ownerUser.imageUrl,
    },
    collaborators: enrichedCollaborators,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const ownership = await requireProjectOwner(projectId);

  if (ownership.status === "unauthorized") return createUnauthorizedResponse();
  if (ownership.status === "forbidden") return createForbiddenResponse();
  if (ownership.status === "not-found") return createNotFoundResponse();

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email } = body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }

  // Check if user is trying to invite themselves (owner)
  const { email: ownerEmail } = await getUserIdentity();
  if (email.toLowerCase() === ownerEmail?.toLowerCase()) {
    return NextResponse.json(
      { error: "You are already the owner of this project" },
      { status: 400 },
    );
  }

  // Check if already a collaborator
  const existing = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email: email.toLowerCase(),
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User is already a collaborator" },
      { status: 400 },
    );
  }

  // Create collaborator
  const collaborator = await prisma.projectCollaborator.create({
    data: {
      projectId,
      email: email.toLowerCase(),
    },
  });

  return NextResponse.json({ collaborator }, { status: 201 });
}
