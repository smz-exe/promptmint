import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Rarity, type Prisma } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const getRarityFromLikes = (likes: number): Rarity => {
  if (likes >= 100) return Rarity.PLATINUM;
  if (likes >= 50) return Rarity.GOLD;
  if (likes >= 20) return Rarity.SILVER;
  return Rarity.BRONZE;
};

export const likeRouter = createTRPCRouter({
  toggle: protectedProcedure
    .input(z.object({ promptCardId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { promptCardId } = input;

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

      // Check if user already liked this card
      const existingLike = await ctx.db.like.findUnique({
        where: {
          userId_promptCardId: {
            userId: ctx.user.id,
            promptCardId,
          },
        },
      });

      let isLiked: boolean;
      let newLikesCount: number;

      if (existingLike) {
        // Unlike - remove the like
        await ctx.db.like.delete({
          where: { id: existingLike.id },
        });

        // Update likes count
        const updatedCard = await ctx.db.promptCard.update({
          where: { id: promptCardId },
          data: {
            likesCount: { decrement: 1 },
          },
        });

        newLikesCount = updatedCard.likesCount;
        isLiked = false;
      } else {
        // Like - create new like
        await ctx.db.like.create({
          data: {
            userId: ctx.user.id,
            promptCardId,
          },
        });

        // Update likes count
        const updatedCard = await ctx.db.promptCard.update({
          where: { id: promptCardId },
          data: {
            likesCount: { increment: 1 },
          },
        });

        newLikesCount = updatedCard.likesCount;
        isLiked = true;
      }

      // Update rarity based on new likes count
      const newRarity = getRarityFromLikes(newLikesCount);
      await ctx.db.promptCard.update({
        where: { id: promptCardId },
        data: { rarity: newRarity },
      });

      return {
        isLiked,
        likesCount: newLikesCount,
        rarity: newRarity,
      };
    }),

  getLikedCards: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      // Build where clause
      const where: Prisma.LikeWhereInput = {
        userId: ctx.user.id,
      };

      if (cursor) {
        where.createdAt = { lt: new Date(cursor) };
      }

      const likes = await ctx.db.like.findMany({
        where,
        orderBy: { createdAt: "desc" },
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

      // Filter out deleted cards
      const validLikes = likes.filter((like) => !like.promptCard.isDeleted);

      // Check if there are more items
      const hasMore = validLikes.length > limit;
      const itemsToReturn = hasMore ? validLikes.slice(0, -1) : validLikes;

      // Generate next cursor
      const nextCursor = hasMore
        ? validLikes[limit - 1]?.createdAt.toISOString()
        : null;

      return {
        cards: itemsToReturn.map((like) => ({
          ...like.promptCard,
          isLikedByUser: true,
        })),
        nextCursor,
      };
    }),
});
