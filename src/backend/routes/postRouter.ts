import * as trpc from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "../createProtectedRouter";

export const postRouter = createProtectedRouter()
	.query("infinite", {
		input: z.object({
			handle: z.string().optional(),
			limit: z.number().min(1).max(100).nullish(),
			cursor: z.string().nullish(),
		}),
		async resolve({ input, ctx }) {
			const limit = input.limit ?? 10;
			const { cursor } = input;
			const where = input?.handle
				? {
						user: {
							handle: input?.handle,
						},
				  }
				: {};
			const posts = await ctx.prisma.post.findMany({
				take: limit + 1,
				cursor: cursor ? { id: cursor } : undefined,
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
			let nextCursor: typeof cursor | null = null;
			if (posts.length > limit) {
				const nextItem = posts.pop();
				nextCursor = nextItem!.id;
			}

			return {
				posts,
				nextCursor,
			};
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
