import { trpc } from "@/lib/trpc";
import { Heading } from "@chakra-ui/react";
import type { NextPage } from "next";

const Home: NextPage = () => {
	const { data, isLoading } = trpc.useQuery(["auth.getSession"]);
	console.log(data, isLoading);
	return <Heading>Hello</Heading>;
};

export default Home;
