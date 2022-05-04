import { Post } from "@/components/Post";
import { Posts } from "@/components/Posts";
import { trpc } from "@/lib/trpc";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { FormEvent } from "react";

const Home: NextPage = () => {
	const { data: posts, isLoading } = trpc.useQuery(["post.getAll"]);
	const client = trpc.useContext();
	const { mutate, isLoading: isPosting } = trpc.useMutation("post.create", {
		async onSuccess() {
			await client.invalidateQueries(["post.getAll"]);
		},
	});
	let [post, setPost] = React.useState("");
	if (isLoading || !posts) {
		return <div>Loading...</div>;
	}
	return (
		<Flex direction="column" gap="10">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					mutate(post);
				}}
			>
				<FormControl>
					<FormLabel htmlFor="post">یه چی بگو:</FormLabel>
					<Textarea
						id="post"
						value={post}
						onChange={(e) => setPost(e.target.value)}
						placeholder="بالام"
						size="sm"
					/>
				</FormControl>
				<Button
					type="submit"
					variant="outline"
					colorScheme="white"
					mt="3"
					isLoading={isPosting}
				>
					ارسال
				</Button>
			</form>
			<Posts posts={posts} />
		</Flex>
	);
};

export default Home;
