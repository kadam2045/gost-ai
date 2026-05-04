import { dark } from "@clerk/ui/themes"

function normalizeAuthPath(value: string | undefined, fallback: string) {
  if (!value) {
    return fallback
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return new URL(value).pathname || fallback
  }

  return value.startsWith("/") ? value : `/${value}`
}

function withCatchAll(pathname: string) {
  if (pathname === "/") {
    return pathname
  }

  return pathname.endsWith("(.*)") ? pathname : `${pathname}(.*)`
}

const signInPath = normalizeAuthPath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  "/sign-in"
)

const signUpPath = normalizeAuthPath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  "/sign-up"
)

export const clerkAuthPaths = {
  signIn: signInPath,
  signUp: signUpPath,
  publicRoutes: [withCatchAll(signInPath), withCatchAll(signUpPath)],
} as const

export const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorBackground: "var(--bg-surface)",
    colorInputBackground: "var(--bg-subtle)",
    colorInputText: "var(--text-primary)",
    colorText: "var(--text-primary)",
    colorTextSecondary: "var(--text-secondary)",
    colorNeutral: "var(--border-subtle)",
    colorSuccess: "var(--state-success)",
    colorDanger: "var(--state-error)",
    colorWarning: "var(--state-warning)",
    colorShimmer: "var(--accent-primary)",
    borderRadius: "1rem",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
  },
  elements: {
    cardBox: "shadow-none",
    card: "border border-surface-border bg-surface",
    headerTitle: "text-copy-primary",
    headerSubtitle: "text-copy-muted",
    socialButtonsBlockButton:
      "border border-surface-border bg-subtle text-copy-primary hover:bg-elevated",
    socialButtonsBlockButtonText: "text-copy-primary",
    formButtonPrimary:
      "bg-brand text-primary-foreground hover:bg-brand/90 shadow-none",
    formFieldInput:
      "border border-surface-border-subtle bg-subtle text-copy-primary",
    formFieldLabel: "text-copy-secondary",
    footerActionLink: "text-brand hover:text-brand",
    identityPreviewText: "text-copy-secondary",
    identityPreviewEditButton: "text-brand hover:text-copy-primary",
    formResendCodeLink: "text-brand hover:text-copy-primary",
    alertText: "text-copy-secondary",
    alertClerkError: "border border-surface-border bg-subtle",
    otpCodeFieldInput:
      "border border-surface-border-subtle bg-subtle text-copy-primary",
  },
}
