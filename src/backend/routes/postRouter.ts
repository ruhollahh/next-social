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
			const prismaPosts = await ctx.prisma.post.findMany({
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
					likes: {
						where: {
							user: {
								id: ctx.session.user.id,
							},
						},
					},
					_count: {
						select: {
							likes: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			let nextCursor: typeof cursor | null = null;
			if (prismaPosts.length > limit) {
				const nextItem = prismaPosts.pop();
				nextCursor = nextItem!.id;
			}

			const posts = prismaPosts.map((post) => {
				const { likes, _count, ...trimedPost } = post;
				return {
					...trimedPost,
					isLikedByMe: post.likes.length > 0,
					likeCount: post._count.likes,
				};
			});

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
	})
	.mutation("like", {
		input: z.string().cuid(),
		async resolve({ input, ctx }) {
			return ctx.prisma.like.create({
				data: {
					post: {
						connect: {
							id: input,
						},
					},
					user: {
						connect: {
							id: ctx.session.user.id,
						},
					},
				},
			});
		},
	})
	.mutation("unlike", {
		input: z.string().cuid(),
		async resolve({ input, ctx }) {
			return ctx.prisma.like.delete({
				where: {
					postId_userId: {
						postId: input,
						userId: ctx.session.user.id,
					},
				},
			});
		},
	});
