import superjson from "superjson";
import { createRouter } from "../createRouter";
import { authRouter } from "./authRouter";
import { postRouter } from "./postRouter";
import { userRouter } from "./userRouter";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("auth.", authRouter)
	.merge("post.", postRouter)
	.merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
