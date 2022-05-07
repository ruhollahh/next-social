import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
	styles: {
		global: {
			"html, body, #__next": {
				height: "100%",
			},
			body: {
				bgColor: "gray.700",
				color: "white",
			},
		},
	},
	fonts: {
		heading: "Vazirmatn, sans-serif",
		body: "Vazirmatn, sans-serif",
	},
});
