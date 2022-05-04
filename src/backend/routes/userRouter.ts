import * as trpc from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "../createProtectedRouter";

export const userRouter = createProtectedRouter()
	.query("profile", {
		async resolve({ ctx }) {
			return await ctx.prisma.user.findUnique({
				where: {
					id: ctx.session.user.id,
				},
				select: {
					id: true,
					name: true,
					image: true,
					about: true,
				},
			});
		},
	})
	.mutation("edit", {
		input: z.object({
			id: z.string().cuid(),
			name: z.string(),
			image: z.string().url(),
			about: z.string(),
		}),
		async resolve({ input, ctx }) {
			if (input.id !== ctx.session.user.id) {
				throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
			}

			return ctx.prisma.user.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
					image: input.image,
					about: input.about,
				},
			});
		},
	});
