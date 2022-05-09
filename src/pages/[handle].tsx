import { PageSpinner } from "@/components/PageSpinner";
import { InfinitePosts } from "@/components/InfinitePosts";
import { trpc } from "@/lib/trpc";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Profile: NextPage = () => {
	const router = useRouter();
	const handle = String(router.query.handle);
	const { data: profile, isLoading: isProfileLoading } = trpc.useQuery([
		"user.profile",
		{ handle },
	]);
	const { data: session } = trpc.useQuery(["auth.getSession"]);
	React.useEffect(() => {
		if (!isProfileLoading && !profile) {
			router.push("/404");
		}
	}, [isProfileLoading, profile, router]);
	if (isProfileLoading || !profile || !session) {
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
			{handle === session?.user.handle && (
				<Link href="/profile/edit" passHref>
					<Button as="a" color="gray.700">
						ویرایش
					</Button>
				</Link>
			)}
			<InfinitePosts handle={session.user.handle} />
		</Flex>
	);
};

export default Profile;
