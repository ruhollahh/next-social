import { trpc } from "@/lib/trpc";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { FormEvent } from "react";

const Home: NextPage = () => {
	const { data: session, isLoading: isSessionLoading } = trpc.useQuery([
		"auth.getSession",
	]);
	const { data: posts, isLoading: isPostsLoading } = trpc.useQuery([
		"post.getAll",
	]);
	const client = trpc.useContext();
	const { mutate, isLoading: isPosting } = trpc.useMutation("post.create", {
		async onSuccess() {
			await client.invalidateQueries(["post.getAll"]);
		},
	});
	let [post, setPost] = React.useState("");
	if (isSessionLoading || !posts || isPostsLoading) {
		return <div>Loading...</div>;
	}
	return (
		<Box>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					mutate(post);
				}}
			>
				<FormControl>
					<FormLabel htmlFor="post">Say something:</FormLabel>
					<Textarea
						id="post"
						value={post}
						onChange={(e) => setPost(e.target.value)}
						placeholder="just chilling"
						size="sm"
					/>
				</FormControl>
				<Button type="submit" isLoading={isPosting}>
					Post
				</Button>
			</form>
			<Box>
				{!posts.length
					? "no posts"
					: posts.map((post) => (
							<VStack key={post.id}>
								<Text>{post.body}</Text>
							</VStack>
					  ))}
			</Box>
		</Box>
	);
};

export default Home;
