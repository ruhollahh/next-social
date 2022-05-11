import { Flex } from "@chakra-ui/react";
import { Post } from "../Post";
import type { PostProps } from "../Post";
import { InfiniteComments } from "../InfiniteComments";

export const PostDetail = ({
	post,
	postsQueryPathAndInput,
	handleShowPostDetail,
}: PostProps) => {
	return (
		<Flex direction="column" gap="5" p="4">
			<Post
				post={post}
				postsQueryPathAndInput={postsQueryPathAndInput}
				handleShowPostDetail={handleShowPostDetail}
			/>
			<InfiniteComments
				postId={post.id}
				postsQueryPathAndInput={postsQueryPathAndInput}
			/>
		</Flex>
	);
};
