import { Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
	const { data, status } = useSession();
	console.log(data, status);
	return <Heading>Hello</Heading>;
};

export default Home;
