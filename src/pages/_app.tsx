import type { AppProps } from "next/app";
import type { AppRouter } from "@/backend/routes/_app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import React from "react";
import { trpc } from "@/lib/trpc";
import { signIn } from "next-auth/react";

const theme = extendTheme({
	styles: {
		global: {
			"html, body, #__next": {
				height: "100%",
			},
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Auth>
				<Component {...pageProps} />
			</Auth>
		</ChakraProvider>
	);
}

function Auth({ children }: { children: React.ReactNode }) {
	const { data: session, isLoading } = trpc.useQuery(["auth.getSession"]);
	const isUser = !!session?.user;
	React.useEffect(() => {
		if (isLoading) return; // Do nothing while loading
		if (!isUser) signIn(); // If not authenticated, force log in
	}, [isUser, isLoading]);

	if (isUser) {
		return <>{children}</>;
	}

	// Session is being fetched, or no user.
	// If no user, useEffect() will redirect.
	return <div>loading...</div>;
}

function getBaseUrl() {
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// // reference for render.com
	if (process.env.RENDER_INTERNAL_HOSTNAME) {
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	}

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		if (typeof window !== "undefined") {
			return {
				url: "/api/trpc",
				transformer: superjson,
			};
		}

		return {
			headers() {
				return (
					ctx?.req?.headers ?? {
						cookie: "",
					}
				);
			},
			url: `${getBaseUrl()}/api/trpc`,
			transformer: superjson,
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: true,
})(MyApp);
