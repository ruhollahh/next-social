import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	},
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],
	callbacks: {
		async jwt({ token, user, isNewUser }) {
			if (isNewUser && user) {
				const handle = user.email?.split("@")[0] || user.id;
				await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						handle,
					},
				});
			}
			const { name, email, picture, sub, ...trimedToken } = token;
			if (user) {
				return {
					...trimedToken,
					userId: user.id,
					handle: user.handle,
				};
			}
			return trimedToken;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					id: token.userId as string,
					handle: token.handle as string,
				},
			};
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
