import { trpc } from "@/lib/trpc";
import { Flex } from "@chakra-ui/react";
import { PageSpinner } from "../PageSpinner";
import InfiniteScroll from "react-infinite-scroller";
import { Post } from "../Post/Post";

export const InfinitePosts = ({ handle }: { handle?: string }) => {
	const { data, isLoading, fetchNextPage, hasNextPage } = trpc.useInfiniteQuery(
		[
			"post.infinite",
			{
				limit: 10,
				handle,
			},
		],
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);
	if (isLoading || !data) {
		return <PageSpinner />;
	}
	return (
		<InfiniteScroll
			loadMore={fetchNextPage}
			hasMore={hasNextPage}
			loader={<PageSpinner key={0} />}
		>
			<Flex direction="column" gap="5" pb="5">
				{data.pages.map(({ posts }) =>
					posts.map((post) => (
						<Post key={post.id} post={post} handle={handle} />
					))
				)}
			</Flex>
		</InfiniteScroll>
	);
};
