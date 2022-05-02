import * as trpc from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const postRouter = createRouter()
	.query("getAll", {
		async resolve({ ctx }) {
			return await ctx.prisma.post.findMany();
		},
	})
	.middleware(({ ctx, next }) => {
		if (!ctx.session) {
			throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
		}

		const isUserAdmin = ctx.session.user.role === "ADMIN";

		return next({
			ctx: {
				...ctx,
				session: ctx.session,
				isUserAdmin,
			},
		});
	})
	.mutation("create", {
		input: z.string().min(1).max(280),
		async resolve({ input, ctx }) {
			return ctx.prisma.post.create({
				data: {
					body: input,
					user: {
						connect: {
							id: ctx.session.user.id,
						},
					},
				},
			});
		},
	});
