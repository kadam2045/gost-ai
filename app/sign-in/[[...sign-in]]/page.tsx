import { SignIn } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { clerkAppearance, clerkAuthPaths } from "@/lib/clerk"

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to continue building collaborative system designs with your team."
      alternateHref={clerkAuthPaths.signUp}
      alternateLabel="Create an account"
      alternateText="Need access?"
    >
      <SignIn
        path={clerkAuthPaths.signIn}
        routing="path"
        signUpUrl={clerkAuthPaths.signUp}
        appearance={clerkAppearance}
      />
    </AuthShell>
  )
}
