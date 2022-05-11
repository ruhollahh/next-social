import { InferQueryPathAndInput, trpc } from "@/lib/trpc";
import { Flex } from "@chakra-ui/react";
import { PageSpinner } from "../PageSpinner";
import InfiniteScroll from "react-infinite-scroller";
import { Post } from "../Post";
import React from "react";
import { PostDetail } from "../PostDetail";
import { BasicModal } from "../BasicModal";

export const InfinitePosts = ({ userHandle }: { userHandle?: string }) => {
	const postsQueryPathAndInput: InferQueryPathAndInput<"post.infinite"> = [
		"post.infinite",
		{
			limit: 10,
			userHandle,
		},
	];
	const { data, isLoading, fetchNextPage, hasNextPage } = trpc.useInfiniteQuery(
		postsQueryPathAndInput,
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);
	const [detailedPost, setDetailedPost] = React.useState<undefined | Post>();
	const handleShowPostDetail = (post: Post) => {
		window.history.pushState({}, "", `/post/${post.id}`);
		setDetailedPost(post);
	};
	const handleClosePostDetail = () => {
		window.history.back();
	};

	const getPostFromUrl = React.useCallback(() => {
		let post: undefined | Post;
		if (window.location.toString().includes("/post")) {
			const urlParts = window.location.toString().split("/");
			const lastIndex = urlParts.length - 1;
			const postId = urlParts[lastIndex];
			post = data?.pages
				.map(({ posts }) => posts)
				.flat()
				.find((post) => post.id === postId);
		}
		return post;
	}, [data?.pages]);

	React.useEffect(() => {
		// need to be updated every time cached data changes
		setDetailedPost(getPostFromUrl());

		// and every time one of the browser's navigation buttons are clicked
		const handlePopState = () => {
			setDetailedPost(getPostFromUrl());
		};

		window.addEventListener("popstate", handlePopState);

		return () => window.removeEventListener("popstate", handlePopState);
	}, [getPostFromUrl]);
	if (isLoading || !data) {
		return <PageSpinner />;
	}
	return (
		<>
			<BasicModal
				isOpen={Boolean(detailedPost)}
				onClose={handleClosePostDetail}
			>
				<PostDetail
					post={detailedPost!}
					postsQueryPathAndInput={postsQueryPathAndInput}
					handleShowPostDetail={() => {}}
				/>
			</BasicModal>
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
								postsQueryPathAndInput={postsQueryPathAndInput}
								handleShowPostDetail={handleShowPostDetail}
							/>
						))
					)}
				</Flex>
			</InfiniteScroll>
		</>
	);
};
