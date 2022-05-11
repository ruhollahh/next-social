import { Flex, FlexProps, Spinner } from "@chakra-ui/react";

export const PageSpinner = (props: FlexProps) => {
	return (
		<Flex w="full" h="full" align="center" justify="center" {...props}>
			<Spinner size="xl" />
		</Flex>
	);
};
