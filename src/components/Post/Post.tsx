import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import moment from "jalali-moment";
import type { inferQueryOutput } from "@/lib/trpc";

export const Post = ({
	post,
	...rest
}: {
	post: inferQueryOutput<"post.infinite">["posts"][0];
}) => {
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
			<Box>
				<Button>Like</Button>
			</Box>
		</Flex>
	);
};
