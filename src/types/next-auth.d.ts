import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			handle: string;
		};
	}

	interface User {
		handle: string;
	}
}
