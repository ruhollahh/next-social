import * as trpc from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "../createProtectedRouter";

export const postRouter = createProtectedRouter()
	.query("getAll", {
		input: z
			.object({
				handle: z.string(),
			})
			.optional(),
		async resolve({ input, ctx }) {
			const where = input?.handle
				? {
						user: {
							handle: input?.handle,
						},
				  }
				: {};
			return await ctx.prisma.post.findMany({
				where,
				include: {
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		},
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
