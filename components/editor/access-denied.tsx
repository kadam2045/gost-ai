import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-6 text-center text-copy-primary">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-subtle ring-1 ring-surface-border">
        <Lock className="h-8 w-8 text-copy-muted" />
      </div>
      <div className="mt-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Access Denied</h1>
        <p className="mx-auto max-w-sm text-base leading-7 text-copy-muted">
          You don&apos;t have permission to access this project, or the project
          doesn&apos;t exist.
        </p>
      </div>
      <div className="mt-10">
        <Link
          href="/editor"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 rounded-2xl px-8"
          )}
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
