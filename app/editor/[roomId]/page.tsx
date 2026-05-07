import { redirect } from "next/navigation";
import { getProjectAccess, getUserIdentity } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/project-api";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";

interface ProjectPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { roomId } = await params;
  const result = await getProjectAccess(roomId);

  if (result.status === "unauthorized") {
    redirect("/sign-in");
  }

  if (result.status === "not-found" || result.status === "forbidden") {
    return <AccessDenied />;
  }

  // If granted, project is available
  const { project } = result;

  // Fetch all projects for the sidebar context
  const { userId, email } = await getUserIdentity();
  const { ownedProjects, sharedProjects } = await getProjectsForUser(
    userId!,
    email,
  );

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      currentUserId={userId!}
    />
  );
}
