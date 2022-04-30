import superjson from "superjson";
import { createRouter } from "../createRouter";
import { authRouter } from "./auth";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
