import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        promptCardId: z.string().uuid("Invalid prompt card ID"),
        reason: z.enum([
          "SPAM",
          "INAPPROPRIATE_CONTENT",
          "COPYRIGHT_VIOLATION",
          "MALICIOUS_PROMPT",
          "OTHER",
        ]),
        description: z
          .string()
          .max(500, "Description must be at most 500 characters")
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { promptCardId, reason, description } = input;

      // Check if the prompt card exists
      const promptCard = await ctx.db.promptCard.findUnique({
        where: { id: promptCardId, isDeleted: false },
      });

      if (!promptCard) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt card not found",
        });
      }

      // Check if user has already reported this card
      const existingReport = await ctx.db.report.findFirst({
        where: {
          promptCardId,
          userId: ctx.user.id,
        },
      });

      if (existingReport) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reported this content",
        });
      }

      // Create the report
      const report = await ctx.db.report.create({
        data: {
          promptCardId,
          userId: ctx.user.id,
          reason,
          description,
        },
      });

      return { report };
    }),

  getReports: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
        status: z
          .enum(["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status } = input;

      // Check if user has admin privileges (this is a placeholder - you'd implement proper admin check)
      // For now, we'll just return empty results for non-admin users
      const isAdmin = false; // TODO: Implement proper admin check

      if (!isAdmin) {
        return {
          reports: [],
          nextCursor: null,
        };
      }

      const where = {
        ...(status && { status }),
        ...(cursor && { createdAt: { lt: new Date(cursor) } }),
      };

      const reports = await ctx.db.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
          promptCard: {
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
      });

      const hasMore = reports.length > limit;
      const itemsToReturn = hasMore ? reports.slice(0, -1) : reports;
      const nextCursor = hasMore
        ? reports[limit - 1]?.createdAt.toISOString()
        : null;

      return {
        reports: itemsToReturn,
        nextCursor,
      };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        reportId: z.string().uuid("Invalid report ID"),
        status: z.enum(["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { reportId, status } = input;

      // Check if user has admin privileges (this is a placeholder - you'd implement proper admin check)
      const isAdmin = false; // TODO: Implement proper admin check

      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update reports",
        });
      }

      // Find the report
      const report = await ctx.db.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Report not found",
        });
      }

      // Update the report
      const updatedReport = await ctx.db.report.update({
        where: { id: reportId },
        data: {
          status,
          ...(status === "RESOLVED" && { resolvedAt: new Date() }),
        },
      });

      return { report: updatedReport };
    }),

  getReportStats: protectedProcedure.query(async ({ ctx }) => {
    // Check if user has admin privileges
    const isAdmin = false; // TODO: Implement proper admin check

    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view report statistics",
      });
    }

    const [total, pending, reviewed, resolved, dismissed] = await Promise.all([
      ctx.db.report.count(),
      ctx.db.report.count({ where: { status: "PENDING" } }),
      ctx.db.report.count({ where: { status: "REVIEWED" } }),
      ctx.db.report.count({ where: { status: "RESOLVED" } }),
      ctx.db.report.count({ where: { status: "DISMISSED" } }),
    ]);

    return {
      total,
      pending,
      reviewed,
      resolved,
      dismissed,
    };
  }),
});
