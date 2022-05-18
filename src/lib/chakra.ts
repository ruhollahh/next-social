import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
	styles: {
		global: {
			"html, body, #__next": {
				height: "100%",
			},
			body: {
				bgColor: "#C4DDFF",
				color: "#001D6E",
			},
		},
	},
	fonts: {
		heading: "Vazirmatn, sans-serif",
		body: "Vazirmatn, sans-serif",
	},
});
