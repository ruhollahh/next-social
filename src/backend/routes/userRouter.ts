import { editProfileValidator } from "@/shared/editProfileValidator";
import * as trpc from "@trpc/server";
import { truncate } from "fs";
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
