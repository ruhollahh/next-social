import { editProfileValidator } from "@/shared/editProfileValidator";
import { z } from "zod";
import { createProtectedRouter } from "../createProtectedRouter";

export const userRouter = createProtectedRouter()
	.query("profile", {
		input: z
			.object({
				handle: z.string(),
			})
			.optional(),
		async resolve({ input, ctx }) {
			const where = input?.handle
				? {
						handle: input?.handle,
				  }
				: { id: ctx.session.user.id };
			return await ctx.prisma.user.findUnique({
				where,
				select: {
					id: true,
					handle: true,
					name: true,
					image: true,
					about: true,
				},
			});
		},
	})
	.mutation("edit", {
		input: editProfileValidator,
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					name: input.name,
					about: input.about,
				},
			});
		},
	})
	.mutation("updateAvatar", {
		input: z.string().url(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					image: input,
				},
			});
		},
	});
