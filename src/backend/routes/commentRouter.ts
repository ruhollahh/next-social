import * as trpc from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "../createProtectedRouter";

export const commentRouter = createProtectedRouter()
	.query("infinite", {
		input: z.object({
			postId: z.string().cuid(),
			limit: z.number().min(1).max(100).nullish(),
			cursor: z.string().nullish(),
		}),
		async resolve({ input, ctx }) {
			const limit = input.limit ?? 10;
			const { cursor } = input;
			const comments = await ctx.prisma.comment.findMany({
				take: limit + 1,
				cursor: cursor ? { id: cursor } : undefined,
				where: {
					post: {
						id: input.postId,
					},
				},
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
			if (comments.length > limit) {
				const nextItem = comments.pop();
				nextCursor = nextItem!.id;
			}

			return {
				comments,
				nextCursor,
			};
		},
	})
	.mutation("create", {
		input: z.object({
			body: z.string().min(1).max(280),
			postId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.comment.create({
				data: {
					body: input.body,
					post: {
						connect: {
							id: input.postId,
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
	.mutation("delete", {
		input: z.string().cuid(),
		async resolve({ input, ctx }) {
			const comment = await ctx.prisma.comment.findUnique({
				where: {
					id: input,
				},
			});
			if (!comment) {
				throw new trpc.TRPCError({ code: "NOT_FOUND" });
			}
			if (comment.userId !== ctx.session.user.id) {
				throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
			}

			return await ctx.prisma.comment.delete({
				where: {
					id: input,
				},
			});
		},
	});
