import { trpc } from "@/lib/trpc";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export const TopBar = () => {
	const { data: session } = trpc.useQuery(["auth.getSession"]);
	return (
		<Box bgColor="#7FB5FF">
			<Container maxW="container.lg">
				<Flex justify="space-between" align="center" gap="5" py="2">
					<Link href="/" passHref>
						<Button
							as="a"
							variant="unstyled"
							height="auto"
							display="block"
							fontSize="lg"
							p="2"
							pb="1"
							bgColor="gray.100"
						>
							نکست سوشال
						</Button>
					</Link>
					<Flex gap="3">
						<Link href={`/${session?.user.handle}`} passHref>
							<Button as="a" variant="ghost">
								پروفایل
							</Button>
						</Link>
						<Button onClick={() => signOut()}>خروج</Button>
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
};
