import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;
      
      const user = await ctx.db.user.findUnique({
        where: { username },
        include: {
          promptCards: {
            where: { isDeleted: false },
            select: { id: true, likesCount: true, forkCount: true },
          },
        },
      });
      
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      
      // Calculate stats
      const stats = {
        totalCards: user.promptCards.length,
        totalLikes: user.promptCards.reduce((sum, card) => sum + card.likesCount, 0),
        totalForks: user.promptCards.reduce((sum, card) => sum + card.forkCount, 0),
      };
      
      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        stats,
      };
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1, "Display name is required").max(50, "Display name must be at most 50 characters").optional(),
        bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
        avatarUrl: z.string().url("Invalid avatar URL").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updates = Object.fromEntries(
        Object.entries(input).filter(([, value]) => value !== undefined)
      );
      
      if (Object.keys(updates).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No updates provided",
        });
      }
      
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: updates,
      });
      
      return {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          displayName: updatedUser.displayName,
          bio: updatedUser.bio,
          avatarUrl: updatedUser.avatarUrl,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      };
    }),

  getFavoriteCards: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
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
      const where: any = {
        userId: user.id,
      };
      
      if (cursor) {
        where.createdAt = { lt: new Date(cursor) };
      }
      
      const likes = await ctx.db.like.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        include: {
          promptCard: {
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
          },
        },
      });
      
      // Filter out likes for deleted cards
      const validLikes = likes.filter(like => like.promptCard && !like.promptCard.isDeleted);
      
      // Check if there are more items
      const hasMore = validLikes.length > limit;
      const itemsToReturn = hasMore ? validLikes.slice(0, -1) : validLikes;
      
      // Generate next cursor
      const nextCursor = hasMore
        ? validLikes[limit - 1]?.createdAt.toISOString()
        : null;
      
      return {
        cards: itemsToReturn.map(like => ({
          ...like.promptCard,
          isLikedByUser: true,
        })),
        nextCursor,
      };
    }),

  searchUsers: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query is required"),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;
      
      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      });
      
      return { users };
    }),
});