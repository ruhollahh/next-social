import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";
import { TopBar } from "../TopBar";

export const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<TopBar />
			<Container as="main" maxW="container.sm" mt="10">
				{children}
			</Container>
		</>
	);
};
