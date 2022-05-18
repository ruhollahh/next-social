import { InfinitePosts } from "@/components/InfinitePosts";
import { trpc } from "@/lib/trpc";
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Textarea,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
	const utils = trpc.useContext();
	let [post, setPost] = React.useState("");
	const { mutate, isLoading: isPosting } = trpc.useMutation("post.create", {
		async onSuccess() {
			await utils.invalidateQueries(["post.infinite"]);
			setPost("");
		},
	});
	return (
		<Flex direction="column" gap="10" bgColor="gray.100" p="5" rounded="md">
			<Flex direction="column" gap="10">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						mutate(post);
					}}
				>
					<FormControl>
						<FormLabel htmlFor="post" color="gray.700">
							یه چی بگو:
						</FormLabel>
						<Textarea
							id="post"
							value={post}
							onChange={(e) => setPost(e.target.value)}
							placeholder="یه چی"
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
				<InfinitePosts />
			</Flex>
		</Flex>
	);
};

export default Home;
