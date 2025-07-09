"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { useAuth } from "~/lib/hooks/useAuth";
import { CommentForm } from "./CommentForm";
import { formatDateSmart } from "~/lib/utils/dateUtils";

interface CommentListProps {
  promptCardId: string;
}

export function CommentList({ promptCardId }: CommentListProps) {
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const { data: currentUser } = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: !!user,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.comment.getByCard.useInfiniteQuery(
      {
        promptCardId,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const utils = api.useUtils();

  const deleteMutation = api.comment.delete.useMutation({
    onSuccess: () => {
      void utils.comment.getByCard.invalidate({ promptCardId });
      void utils.promptCard.getById.invalidate({ id: promptCardId });
    },
  });

  const handleDelete = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate({ id: commentId });
    }
  };

  const handleEdit = (commentId: string) => {
    setEditingCommentId(commentId);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
  };

  const handleEditSuccess = () => {
    setEditingCommentId(null);
    void utils.comment.getByCard.invalidate({ promptCardId });
  };

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              <div className="flex-1">
                <div className="mb-2 h-4 w-24 rounded bg-gray-300"></div>
                <div className="h-16 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Image
            src={comment.user.avatarUrl ?? "/default-avatar.png"}
            alt={comment.user.displayName}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Link
                href={`/profile/${comment.user.username}`}
                className="font-medium hover:underline"
              >
                {comment.user.displayName}
              </Link>
              <span className="text-muted-foreground text-sm">
                {formatDateSmart(new Date(comment.createdAt), "comment")}
              </span>
              {currentUser?.id === comment.user.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(comment.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {editingCommentId === comment.id ? (
              <CommentForm
                promptCardId={promptCardId}
                isEditing={true}
                editingCommentId={comment.id}
                initialContent={comment.content}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            ) : (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {hasNextPage && (
        <div className="pt-4 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More Comments"}
          </Button>
        </div>
      )}
    </div>
  );
}
