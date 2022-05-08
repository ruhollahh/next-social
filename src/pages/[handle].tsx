import { PageSpinner } from "@/components/PageSpinner";
import { Posts } from "@/components/Posts";
import { trpc } from "@/lib/trpc";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Profile: NextPage = () => {
	const router = useRouter();
	const handle = String(router.query.handle);
	if (!handle) {
		return null;
	}
	const { data: profile, isLoading: isProfileLoading } = trpc.useQuery([
		"user.profile",
	]);
	const { data: posts, isLoading: isPostsLoading } = trpc.useQuery([
		"post.getAll",
		{ handle },
	]);
	if (isProfileLoading || !profile || isPostsLoading || !posts) {
		return <PageSpinner />;
	}
	return (
		<Flex
			direction="column"
			gap="10"
			bgColor="gray.100"
			p="5"
			color="gray.700"
			rounded="md"
		>
			<Heading fontSize="xl" alignSelf="center">
				پروفایل
			</Heading>
			<Flex direction="column" gap="3" alignItems="center">
				<Avatar name={profile.name!} src={profile.image!} size="lg" />
				<Text fontSize="lg">{profile.name}</Text>
				<Text>{profile.about!}</Text>
			</Flex>
			{/* <Link href="/profile/edit" passHref>
				<Button as="a" color="gray.700">
					ویرایش
				</Button>
			</Link> */}
			<Posts posts={posts} />
		</Flex>
	);
};

export default Profile;
