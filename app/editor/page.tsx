import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { EditorShell } from "@/components/editor/editor-shell"
import { getProjectsForUser } from "@/lib/project-api"

export default async function EditorPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  const email = user?.emailAddresses[0]?.emailAddress
  const { ownedProjects, sharedProjects } = await getProjectsForUser(userId, email)

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
