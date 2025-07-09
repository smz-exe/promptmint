import { authRouter } from "~/server/api/routers/auth";
import { userRouter } from "~/server/api/routers/user";
import { promptCardRouter } from "~/server/api/routers/promptCard";
import { likeRouter } from "~/server/api/routers/like";
import { commentRouter } from "~/server/api/routers/comment";
import { metadataRouter } from "~/server/api/routers/metadata";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  promptCard: promptCardRouter,
  like: likeRouter,
  comment: commentRouter,
  metadata: metadataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
