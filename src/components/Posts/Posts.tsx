import type { inferQueryOutput } from "@/lib/trpc";
import { Flex } from "@chakra-ui/react";
import { Post } from "../Post/Post";

export const Posts = ({
	posts,
}: {
	posts: inferQueryOutput<"post.getAll">;
}) => {
	return (
		<Flex direction="column" gap="5">
			{!posts?.length
				? "no posts"
				: posts?.map((post) => <Post key={post.id} post={post} />)}
		</Flex>
	);
};
