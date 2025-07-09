import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        promptCardId: z.string().uuid(),
        content: z
          .string()
          .min(1, "Comment cannot be empty")
          .max(1000, "Comment must be at most 1000 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { promptCardId, content } = input;

      // Check if prompt card exists
      const promptCard = await ctx.db.promptCard.findUnique({
        where: { id: promptCardId, isDeleted: false },
      });

      if (!promptCard) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt card not found",
        });
      }

      // Create the comment
      const comment = await ctx.db.comment.create({
        data: {
          promptCardId,
          userId: ctx.user.id,
          content,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update comment count
      await ctx.db.promptCard.update({
        where: { id: promptCardId },
        data: { commentCount: { increment: 1 } },
      });

      return { comment };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        content: z
          .string()
          .min(1, "Comment cannot be empty")
          .max(1000, "Comment must be at most 1000 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content } = input;

      // Check if comment exists and user owns it
      const existingComment = await ctx.db.comment.findUnique({
        where: { id },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (existingComment.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own comments",
        });
      }

      // Update the comment
      const updatedComment = await ctx.db.comment.update({
        where: { id },
        data: { content },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      return { comment: updatedComment };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Check if comment exists and user owns it
      const existingComment = await ctx.db.comment.findUnique({
        where: { id },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (existingComment.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own comments",
        });
      }

      // Delete the comment
      await ctx.db.comment.delete({
        where: { id },
      });

      // Update comment count
      await ctx.db.promptCard.update({
        where: { id: existingComment.promptCardId },
        data: { commentCount: { decrement: 1 } },
      });

      return { success: true };
    }),

  getByCard: publicProcedure
    .input(
      z.object({
        promptCardId: z.string().uuid(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { promptCardId, limit, cursor } = input;

      // Build where clause
      const where: any = {
        promptCardId,
      };

      if (cursor) {
        where.createdAt = { lt: new Date(cursor) };
      }

      const comments = await ctx.db.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Check if there are more items
      const hasMore = comments.length > limit;
      const itemsToReturn = hasMore ? comments.slice(0, -1) : comments;

      // Generate next cursor
      const nextCursor = hasMore
        ? comments[limit - 1]?.createdAt.toISOString()
        : null;

      return {
        comments: itemsToReturn,
        nextCursor,
      };
    }),
});
