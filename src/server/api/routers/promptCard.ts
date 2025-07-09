import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type Prisma } from "@prisma/client";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const promptCardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(1, "Title is required")
          .max(200, "Title must be at most 200 characters"),
        description: z.string().min(1, "Description is required"),
        promptText: z
          .string()
          .min(1, "Prompt text is required")
          .max(5000, "Prompt text must be at most 5000 characters"),
        categoryId: z.string().uuid("Invalid category ID"),
        aiModelId: z.string().uuid("Invalid AI model ID"),
        parentPromptId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        title,
        description,
        promptText,
        categoryId,
        aiModelId,
        parentPromptId,
      } = input;

      // Verify category exists
      const category = await ctx.db.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category not found",
        });
      }

      // Verify AI model exists
      const aiModel = await ctx.db.aIModel.findUnique({
        where: { id: aiModelId },
      });
      if (!aiModel) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "AI model not found",
        });
      }

      // Verify parent prompt exists if provided
      if (parentPromptId) {
        const parentPrompt = await ctx.db.promptCard.findUnique({
          where: { id: parentPromptId, isDeleted: false },
        });
        if (!parentPrompt) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Parent prompt not found",
          });
        }
      }

      // Create the prompt card
      const promptCard = await ctx.db.promptCard.create({
        data: {
          title,
          description,
          promptText,
          categoryId,
          aiModelId,
          authorId: ctx.user.id,
          parentPromptId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          category: true,
          aiModel: true,
        },
      });

      // Update fork count for parent prompt
      if (parentPromptId) {
        await ctx.db.promptCard.update({
          where: { id: parentPromptId },
          data: { forkCount: { increment: 1 } },
        });
      }

      return { card: promptCard };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().min(1).optional(),
        promptText: z.string().min(1).max(5000).optional(),
        categoryId: z.string().uuid().optional(),
        aiModelId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      // Verify ownership
      const existingCard = await ctx.db.promptCard.findUnique({
        where: { id, isDeleted: false },
      });

      if (!existingCard) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt card not found",
        });
      }

      if (existingCard.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own prompt cards",
        });
      }

      // Update the prompt card
      const updatedCard = await ctx.db.promptCard.update({
        where: { id },
        data: updates,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          category: true,
          aiModel: true,
        },
      });

      return { card: updatedCard };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Verify ownership
      const existingCard = await ctx.db.promptCard.findUnique({
        where: { id, isDeleted: false },
      });

      if (!existingCard) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt card not found",
        });
      }

      if (existingCard.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own prompt cards",
        });
      }

      // Soft delete the prompt card
      await ctx.db.promptCard.update({
        where: { id },
        data: { isDeleted: true },
      });

      return { success: true };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const card = await ctx.db.promptCard.findUnique({
        where: { id: input.id, isDeleted: false },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          category: true,
          aiModel: true,
          parentPrompt: {
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
      });

      if (!card) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt card not found",
        });
      }

      // Check if current user liked this card
      let isLikedByUser = false;
      if (ctx.user) {
        const like = await ctx.db.like.findUnique({
          where: {
            userId_promptCardId: {
              userId: ctx.user.id,
              promptCardId: card.id,
            },
          },
        });
        isLikedByUser = !!like;
      }

      return {
        card: {
          ...card,
          isLikedByUser,
        },
      };
    }),

  getFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
        filter: z
          .object({
            categoryId: z.string().uuid().optional(),
            aiModelId: z.string().uuid().optional(),
            authorId: z.string().uuid().optional(),
            search: z.string().optional(),
          })
          .optional(),
        orderBy: z.enum(["latest", "popular"]).default("latest"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, filter, orderBy } = input;

      // Build where clause
      const where: Prisma.PromptCardWhereInput = {
        isDeleted: false,
      };

      if (filter?.categoryId) {
        where.categoryId = filter.categoryId;
      }

      if (filter?.aiModelId) {
        where.aiModelId = filter.aiModelId;
      }

      if (filter?.authorId) {
        where.authorId = filter.authorId;
      }

      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: "insensitive" } },
          { description: { contains: filter.search, mode: "insensitive" } },
        ];
      }

      // Add cursor condition
      if (cursor) {
        if (orderBy === "latest") {
          where.createdAt = { lt: new Date(cursor) };
        } else {
          where.likesCount = { lt: parseInt(cursor) };
        }
      }

      // Build order by clause
      const orderByClause =
        orderBy === "latest"
          ? { createdAt: "desc" as const }
          : { likesCount: "desc" as const };

      const cards = await ctx.db.promptCard.findMany({
        where,
        orderBy: orderByClause,
        take: limit + 1,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          category: true,
          aiModel: true,
        },
      });

      // Check if user liked each card
      const cardsWithLikeStatus = await Promise.all(
        cards.map(async (card) => {
          let isLikedByUser = false;
          if (ctx.user) {
            const like = await ctx.db.like.findUnique({
              where: {
                userId_promptCardId: {
                  userId: ctx.user.id,
                  promptCardId: card.id,
                },
              },
            });
            isLikedByUser = !!like;
          }

          return {
            ...card,
            // Truncate prompt text for feed
            promptText:
              card.promptText.length > 500
                ? card.promptText.substring(0, 500) + "..."
                : card.promptText,
            isLikedByUser,
          };
        }),
      );

      // Check if there are more items
      const hasMore = cards.length > limit;
      const itemsToReturn = hasMore
        ? cardsWithLikeStatus.slice(0, -1)
        : cardsWithLikeStatus;

      // Generate next cursor
      const nextCursor = hasMore
        ? orderBy === "latest"
          ? cards[limit - 1]?.createdAt.toISOString()
          : cards[limit - 1]?.likesCount.toString()
        : null;

      return {
        cards: itemsToReturn,
        nextCursor,
        hasMore,
      };
    }),

  getUserCards: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { username, limit, cursor } = input;

      // Find user by username
      const user = await ctx.db.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Build where clause
      const where: Prisma.PromptCardWhereInput = {
        authorId: user.id,
        isDeleted: false,
      };

      if (cursor) {
        where.createdAt = { lt: new Date(cursor) };
      }

      const cards = await ctx.db.promptCard.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          category: true,
          aiModel: true,
        },
      });

      // Check if there are more items
      const hasMore = cards.length > limit;
      const itemsToReturn = hasMore ? cards.slice(0, -1) : cards;

      // Generate next cursor
      const nextCursor = hasMore
        ? cards[limit - 1]?.createdAt.toISOString()
        : null;

      return {
        cards: itemsToReturn,
        nextCursor,
      };
    }),
});
