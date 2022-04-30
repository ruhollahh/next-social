import type { AppProps } from "next/app";
import type { AppRouter } from "@/backend/routes/_app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import superjson from "superjson";

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
			<Component {...pageProps} />
		</ChakraProvider>
	);
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
