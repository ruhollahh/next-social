import { InferQueryPathAndInput, trpc } from "@/lib/trpc";
import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Text,
	Textarea,
} from "@chakra-ui/react";
import moment from "jalali-moment";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { PageSpinner } from "../PageSpinner";
import { PostProps } from "../Post";

type InfiniteCommentsProps = {
	postId: string;
	postsQueryPathAndInput: PostProps["postsQueryPathAndInput"];
};

export const InfiniteComments = ({
	postId,
	postsQueryPathAndInput,
}: InfiniteCommentsProps) => {
	const utils = trpc.useContext();
	const { data: session } = trpc.useQuery(["auth.getSession"]);
	const commentsQueryPathAndInput: InferQueryPathAndInput<"comment.infinite"> =
		["comment.infinite", { limit: 5, postId }];
	const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
		trpc.useInfiniteQuery(commentsQueryPathAndInput, {
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		});

	const [comment, setComment] = React.useState("");
	const createCommentMutation = trpc.useMutation("comment.create", {
		async onSuccess() {
			//get new comments from server
			await utils.invalidateQueries(commentsQueryPathAndInput);

			// update comment count in the cache
			await utils.cancelQuery(["post.infinite"]);

			utils.setInfiniteQueryData(postsQueryPathAndInput, (data) => {
				if (!data) {
					return {
						pages: [],
						pageParams: [],
					};
				}

				return {
					...data,
					pages: data.pages.map((page) => ({
						...page,
						posts: page.posts.map((post) =>
							post.id === postId
								? {
										...post,
										commentCount: post.commentCount + 1,
								  }
								: post
						),
					})),
				};
			});
			setComment("");
		},
	});

	const [commentIdBeingDeleted, setCommentIdBeingDeleted] = React.useState<
		null | string
	>(null);
	const deleteCommentMutation = trpc.useMutation("comment.delete", {
		async onSuccess() {
			//get new comments from server
			await utils.invalidateQueries(commentsQueryPathAndInput);

			// update comment count in the cache
			await utils.cancelQuery(["post.infinite"]);

			utils.setInfiniteQueryData(postsQueryPathAndInput, (data) => {
				if (!data) {
					return {
						pages: [],
						pageParams: [],
					};
				}

				return {
					...data,
					pages: data.pages.map((page) => ({
						...page,
						posts: page.posts.map((post) =>
							post.id === postId
								? {
										...post,
										commentCount: post.commentCount - 1,
								  }
								: post
						),
					})),
				};
			});
		},
	});

	if (isLoading || !data) {
		return <PageSpinner color="gray.700" />;
	}

	return (
		<Flex direction="column" gap="3" p="4" color="gray.700">
			{data.pages.map(({ comments }) =>
				comments.map((comment) => (
					<Flex
						key={comment.id}
						direction="column"
						gap="3"
						rounded="md"
						border="1px solid"
						p="3"
					>
						<Flex justify="space-between" gap="3">
							<Flex gap="3" align="center">
								<Avatar
									name={comment.user.name!}
									src={comment.user.image!}
									size="sm"
								/>
								<Box>
									<Text fontSize="12px">{comment.user.name}</Text>
									<Text fontSize="10px" fontStyle="italic">
										{moment(comment.createdAt, "YYYY/MM/DD")
											.locale("fa")
											.fromNow()}
									</Text>
								</Box>
							</Flex>
							{comment.userId === session?.user.id && (
								<IconButton
									aria-label="delete"
									icon={<AiOutlineDelete />}
									isLoading={
										deleteCommentMutation.isLoading &&
										commentIdBeingDeleted === comment.id
									}
									onClick={() => {
										setCommentIdBeingDeleted(comment.id);
										deleteCommentMutation.mutate(comment.id);
									}}
								/>
							)}
						</Flex>
						<Box>
							<Text fontSize="small">{comment.body}</Text>
						</Box>
					</Flex>
				))
			)}
			{hasNextPage &&
				(isFetching ? (
					<PageSpinner color="gray.700" />
				) : (
					<Button onClick={() => fetchNextPage()}>مشاهده بیشتر</Button>
				))}
			<Flex direction="column" gap="10">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createCommentMutation.mutate({ postId, body: comment });
					}}
				>
					<FormControl>
						<FormLabel htmlFor="post">نظره؟</FormLabel>
						<Textarea
							id="post"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							size="sm"
						/>
					</FormControl>
					<Button
						type="submit"
						variant="outline"
						colorScheme="white"
						mt="3"
						isLoading={createCommentMutation.isLoading}
					>
						ارسال
					</Button>
				</form>
			</Flex>
		</Flex>
	);
};
