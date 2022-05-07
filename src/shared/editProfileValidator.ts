import { z } from "zod";

export const editProfileValidator = z.object({
	name: z.string().min(2).max(32),
	about: z.string().max(280).nullable(),
});

export type EditProfile = z.infer<typeof editProfileValidator>;
