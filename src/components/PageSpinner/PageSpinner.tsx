import { Flex, Spinner } from "@chakra-ui/react";

export const PageSpinner = () => {
	return (
		<Flex w="full" h="full" align="center" justify="center">
			<Spinner size="xl" />
		</Flex>
	);
};
