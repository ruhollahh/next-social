import type { AppProps } from "next/app";
import type { AppRouter } from "@/backend/routes/_app";
import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import React from "react";
import "vazirmatn/Vazirmatn-font-face.css";
import { trpc } from "@/lib/trpc";
import { signIn } from "next-auth/react";
import { Layout } from "@/components/Layout";
import { theme } from "@/lib/chakra";
import { PageSpinner } from "@/components/PageSpinner";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Auth>
				<Layout>
					<Component {...pageProps} />
				</Layout>
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
	return <PageSpinner />;
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
				queryClientConfig: {
					defaultOptions: {
						queries: {
							refetchOnWindowFocus: false,
						},
					},
				},
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
	responseMeta({ clientErrors, ctx }) {
		if (clientErrors.length) {
			// propagate first http error from API calls
			return {
				status: clientErrors?.[0]?.data?.httpStatus ?? 500,
			};
		}
		// cache full page for 1 day + revalidate once every second
		const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
		return {
			"Cache-Control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
		};
	},
})(MyApp);
