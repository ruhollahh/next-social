import { Button, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";

const Profile: NextPage = () => {
	return (
		<>
			<Link href={`/profile/edit`} passHref>
				<Button as="a" color="gray.700">
					ویرایش
				</Button>
			</Link>
			<Heading>Hello</Heading>
		</>
	);
};

export default Profile;
