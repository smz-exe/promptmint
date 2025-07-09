import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const metadataRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: { order: "asc" },
    });

    return { categories };
  }),

  getAIModels: publicProcedure.query(async ({ ctx }) => {
    const aiModels = await ctx.db.aIModel.findMany({
      orderBy: { order: "asc" },
    });

    return { aiModels };
  }),
});
