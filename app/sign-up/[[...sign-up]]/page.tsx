import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { clerkAppearance, clerkAuthPaths } from "@/lib/clerk"

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your workspace and start shaping architecture with shared context."
      alternateHref={clerkAuthPaths.signIn}
      alternateLabel="Sign in"
      alternateText="Already have an account?"
    >
      <SignUp
        path={clerkAuthPaths.signUp}
        routing="path"
        signInUrl={clerkAuthPaths.signIn}
        appearance={clerkAppearance}
      />
    </AuthShell>
  )
}
