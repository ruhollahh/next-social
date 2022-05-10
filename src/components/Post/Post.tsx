import { Avatar, Box, Flex, Text, Button } from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import moment from "jalali-moment";
import { inferQueryOutput, trpc } from "@/lib/trpc";

export type Post = inferQueryOutput<"post.infinite">["posts"][0];
export type PostProps = {
	post: Post;
	userHandle?: string;
	handleShowComments: (post: Post) => void;
};

export const Post = ({
	post,
	userHandle,
	handleShowComments,
	...rest
}: PostProps) => {
	const utils = trpc.useContext();
	const likeMutation = trpc.useMutation("post.like", {
		async onMutate(likedPostId) {
			await utils.cancelQuery(["post.infinite"]);
			const prevPosts = utils.getInfiniteQueryData([
				"post.infinite",
				{ limit: 10, userHandle },
			]);

			utils.setInfiniteQueryData(
				["post.infinite", { limit: 10, userHandle }],
				(data) => {
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
								post.id === likedPostId
									? {
											...post,
											likeCount: post.likeCount + 1,
											isLikedByMe: true,
									  }
									: post
							),
						})),
					};
				}
			);

			return { prevPosts };
		},
		onError: (_err, _id, context: any) => {
			if (context?.prevPosts) {
				utils.setInfiniteQueryData(
					["post.infinite", { limit: 10, userHandle }],
					context.prevPosts
				);
			}
		},
	});

	const unlikeMutation = trpc.useMutation("post.unlike", {
		async onMutate(unLikedPostId) {
			await utils.cancelQuery(["post.infinite"]);
			const prevPosts = utils.getInfiniteQueryData([
				"post.infinite",
				{ limit: 10, userHandle },
			]);

			utils.setInfiniteQueryData(
				["post.infinite", { limit: 10, userHandle }],
				(data) => {
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
								post.id === unLikedPostId
									? {
											...post,
											likeCount: post.likeCount - 1,
											isLikedByMe: false,
									  }
									: post
							),
						})),
					};
				}
			);

			return { prevPosts };
		},
		onError: (_err, _id, context: any) => {
			if (context?.prevPosts) {
				utils.setInfiniteQueryData(
					["post.infinite", { limit: 10, userHandle }],
					context.prevPosts
				);
			}
		},
	});
	return (
		<Flex
			direction="column"
			gap="3"
			bgColor="#F1F3F8"
			p="4"
			rounded="lg"
			color="gray.700"
			{...rest}
		>
			<Flex gap="3" align="center">
				<Avatar name={post.user.name!} src={post.user.image!} />
				<Box>
					<Text fontSize="sm">{post.user.name}</Text>
					<Text fontSize="12px" fontStyle="italic">
						{moment(post.createdAt, "YYYY/MM/DD").locale("fa").fromNow()}
					</Text>
				</Box>
			</Flex>
			<Box>
				<Text>{post.body}</Text>
			</Box>
			<Flex alignSelf="flex-end">
				{post.isLikedByMe ? (
					<Button
						aria-label="unlike"
						rightIcon={<AiFillHeart fontSize={24} />}
						onClick={() => unlikeMutation.mutate(post.id)}
					>
						{post.likeCount}
					</Button>
				) : (
					<Button
						aria-label="like"
						rightIcon={<AiOutlineHeart fontSize={24} />}
						onClick={() => likeMutation.mutate(post.id)}
					>
						{post.likeCount}
					</Button>
				)}
				<Button onClick={() => handleShowComments(post)}>comments</Button>
			</Flex>
		</Flex>
	);
};
