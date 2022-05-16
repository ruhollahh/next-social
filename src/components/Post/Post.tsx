import { Avatar, Box, Flex, Text, Button } from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import moment from "jalali-moment";
import { InferQueryOutput, InferQueryPathAndInput, trpc } from "@/lib/trpc";
import Link from "next/link";

export type Post = InferQueryOutput<"post.infinite">["posts"][0];
export type PostProps = {
	post: Post;
	postsQueryPathAndInput: InferQueryPathAndInput<"post.infinite">;
	handleShowPostDetail: (post: Post) => void;
};

export const Post = ({
	post,
	postsQueryPathAndInput,
	handleShowPostDetail,
	...rest
}: PostProps) => {
	const utils = trpc.useContext();
	const likeMutation = trpc.useMutation("post.like", {
		async onMutate(likedPostId) {
			await utils.cancelQuery(["post.infinite"]);
			const prevPosts = utils.getInfiniteQueryData(postsQueryPathAndInput);

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
			});

			return { prevPosts };
		},
		onError: (_err, _id, context: any) => {
			if (context?.prevPosts) {
				utils.setInfiniteQueryData(postsQueryPathAndInput, context.prevPosts);
			}
		},
	});

	const unlikeMutation = trpc.useMutation("post.unlike", {
		async onMutate(unLikedPostId) {
			await utils.cancelQuery(["post.infinite"]);
			const prevPosts = utils.getInfiniteQueryData(postsQueryPathAndInput);

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
			});

			return { prevPosts };
		},
		onError: (_err, _id, context: any) => {
			if (context?.prevPosts) {
				utils.setInfiniteQueryData(postsQueryPathAndInput, context.prevPosts);
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
					<Text fontSize="sm">
						<Link href={`/${post.user.handle}`}>
							<a>{post.user.name}</a>
						</Link>
					</Text>
					<Text fontSize="12px" fontStyle="italic">
						{moment(post.createdAt, "YYYY/MM/DD").locale("fa").fromNow()}
					</Text>
				</Box>
			</Flex>
			<Box>
				<Text>{post.body}</Text>
			</Box>
			<Flex alignSelf="flex-end" gap="2">
				<Button
					aria-label="show post detail"
					rightIcon={<AiOutlineComment fontSize={24} />}
					onClick={() => handleShowPostDetail(post)}
				>
					{post.commentCount}
				</Button>
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
			</Flex>
		</Flex>
	);
};
