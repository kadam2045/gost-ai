import Link from "next/link"
import type { ReactNode } from "react"
import {
  BrainCircuit,
  Network,
  ScrollText,
} from "lucide-react"

interface AuthShellProps {
  alternateHref: string
  alternateLabel: string
  alternateText: string
  children: ReactNode
  title: string
}

const featureLines = [
  {
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
    icon: BrainCircuit,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
    icon: Network,
  },
  {
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
    icon: ScrollText,
  },
]

export function AuthShell({
  alternateHref,
  alternateLabel,
  alternateText,
  children,
  title,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-base text-copy-primary">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-surface-border bg-surface lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-14">
          <div className="space-y-14">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-semibold text-primary-foreground">
                G
              </div>

              <p className="text-xl font-medium tracking-tight text-copy-primary">
                Ghost AI
              </p>
            </div>

            <div className="max-w-xl space-y-8">
              <div className="space-y-5">
                <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-copy-primary xl:text-5xl">
                  Design systems at the speed of thought.
                </h1>

                <p className="max-w-md text-lg leading-8 text-copy-secondary xl:text-xl xl:leading-9">
                  Describe your architecture in plain English. Ghost AI maps it
                  to a shared canvas your whole team can refine in real time.
                </p>
              </div>

              <div className="space-y-8">
                {featureLines.map(({ description, icon: Icon, title: featureTitle }) => (
                  <div key={featureTitle} className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-dim text-brand">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-medium tracking-tight text-copy-primary xl:text-xl">
                        {featureTitle}
                      </h2>
                      <p className="max-w-lg text-sm leading-6 text-copy-muted xl:text-base">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-copy-faint">
            Built for fast architecture iteration in a focused dark workspace.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10 xl:px-14">
          <div className="flex w-full max-w-[34rem] flex-col gap-6">
            <div className="space-y-3 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-primary-foreground">
                  G
                </div>

                <p className="text-2xl font-medium tracking-tight text-copy-primary">
                  Ghost AI
                </p>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-copy-primary">
                {title}
              </h1>
            </div>

            {children}

            <p className="text-center text-sm text-copy-muted">
              {alternateText}{" "}
              <Link
                href={alternateHref}
                className="font-medium text-brand transition-colors hover:text-copy-primary"
              >
                {alternateLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
