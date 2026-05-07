"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Copy, Trash2, Check } from "lucide-react";

import {
  EditorDialog,
  EditorDialogShell,
  EditorDialogShellBody,
  EditorDialogShellFooter,
  EditorDialogShellHeader,
} from "@/components/editor/editor-dialog-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface Collaborator {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
}

interface Owner {
  userId: string;
  name: string;
  imageUrl: string | null;
}

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentUserId: string;
}

export function ShareDialog({
  isOpen,
  onOpenChange,
  projectId,
  currentUserId,
}: ShareDialogProps) {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = owner?.userId === currentUserId;

  const fetchCollaborators = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data = await res.json();
        setOwner(data.owner);
        setCollaborators(data.collaborators);
      }
    } catch (error) {
      console.error("Failed to fetch collaborators", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        void fetchCollaborators();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fetchCollaborators]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || isInviting) return;

    setIsInviting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (res.ok) {
        setInviteEmail("");
        void fetchCollaborators();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to invite collaborator");
      }
    } catch (error) {
      console.error("Failed to invite collaborator", error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;

    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        void fetchCollaborators();
      }
    } catch (error) {
      console.error("Failed to remove collaborator", error);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/editor/${projectId}`;
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <EditorDialog open={isOpen} onOpenChange={onOpenChange}>
      <EditorDialogShell className="max-w-md">
        <EditorDialogShellHeader
          title="Share Project"
          description="Invite collaborators to design this architecture with you."
        />

        <EditorDialogShellBody className="space-y-6">
          {isOwner && (
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                placeholder="Email address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-11 rounded-xl border-surface-border bg-base text-copy-primary placeholder:text-copy-faint px-4 focus-visible:ring-brand/40"

                required
              />
              <Button
                type="submit"
                disabled={isInviting || !inviteEmail}
                className="h-11 rounded-xl px-4"
              >
                {isInviting ? "..." : "Invite"}
              </Button>
            </form>
          )}

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-copy-muted">
              People with access
            </p>
            <ScrollArea className="max-h-[300px] overflow-hidden rounded-xl">
              <div className="space-y-4 pr-4">
                {/* Owner */}
                {owner && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-surface-border">
                        {owner.imageUrl ? (
                          <Image
                            src={owner.imageUrl || ""}
                            alt={owner.name}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-subtle text-sm font-medium text-copy-primary">
                            {owner.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-copy-primary">
                          {owner.name}
                        </p>
                        <p className="text-xs text-copy-muted">Owner</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collaborators */}
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-surface-border">
                        {collab.imageUrl ? (
                          <Image
                            src={collab.imageUrl}
                            alt={collab.name || collab.email}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-subtle text-sm font-medium text-copy-primary">
                            {(collab.name || collab.email)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-copy-primary">
                          {collab.name || collab.email}
                        </p>
                        <p className="truncate text-xs text-copy-muted">
                          {collab.name ? collab.email : "Collaborator"}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => void handleRemove(collab.id)}
                        className="text-copy-muted hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${collab.name || collab.email}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {isLoading && collaborators.length === 0 && (
                  <p className="py-4 text-center text-sm text-copy-muted">
                    Loading collaborators...
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </EditorDialogShellBody>

        <EditorDialogShellFooter className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl border-surface-border bg-transparent px-4 text-copy-secondary hover:bg-subtle hover:text-copy-primary"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="h-11 rounded-xl px-4 text-copy-muted hover:bg-subtle hover:text-copy-primary"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </EditorDialogShellFooter>
      </EditorDialogShell>
    </EditorDialog>
  );
}
