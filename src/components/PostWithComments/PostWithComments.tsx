import { Flex } from "@chakra-ui/react";
import { Post } from "../Post";
import type { PostProps } from "../Post/";

export const PostWithComments = (props: PostProps) => {
	return (
		<Flex direction="column" gap="5" bgColor="gray.700" p="4">
			<Post {...props} />
		</Flex>
	);
};
