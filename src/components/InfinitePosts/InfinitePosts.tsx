import { inferQueryOutput, trpc } from "@/lib/trpc";
import { Flex } from "@chakra-ui/react";
import { PageSpinner } from "../PageSpinner";
import InfiniteScroll from "react-infinite-scroller";
import { Post } from "../Post";
import React from "react";

export const InfinitePosts = ({ userHandle }: { userHandle?: string }) => {
	const { data, isLoading, fetchNextPage, hasNextPage } = trpc.useInfiniteQuery(
		[
			"post.infinite",
			{
				limit: 10,
				userHandle,
			},
		],
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);
	const [postWithComments, setPostWithComments] = React.useState<
		undefined | Post
	>();
	const handleShowComments = (post: Post) => {
		window.history.pushState({}, "", `/post/${post.id}`);
		setPostWithComments(post);
	};
	const handleCloseComments = () => {
		window.history.back();
	};

	React.useEffect(() => {
		const handlePopState = () => {
			if (window.location.toString().includes("/post")) {
				const urlParts = window.location.toString().split("/");
				const lastIndex = urlParts.length - 1;
				const postId = urlParts[lastIndex];
				const post = data?.pages
					.map(({ posts }) => posts)
					.flat()
					.find((post) => post.id === postId);
				setPostWithComments(post);
			} else {
				setPostWithComments(undefined);
			}
		};

		window.addEventListener("popstate", handlePopState);

		return () => window.removeEventListener("popstate", handlePopState);
	}, [data?.pages]);
	if (isLoading || !data) {
		return <PageSpinner />;
	}
	return (
		<>
			{postWithComments && <button onClick={handleCloseComments}>close</button>}

			<InfiniteScroll
				loadMore={fetchNextPage}
				hasMore={hasNextPage}
				loader={<PageSpinner key={0} />}
			>
				<Flex direction="column" gap="5" pb="5">
					{data.pages.map(({ posts }) =>
						posts.map((post) => (
							<Post
								key={post.id}
								post={post}
								userHandle={userHandle}
								handleShowComments={handleShowComments}
							/>
						))
					)}
				</Flex>
			</InfiniteScroll>
		</>
	);
};
