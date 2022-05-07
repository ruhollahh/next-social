import { trpc } from "@/lib/trpc";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export const TopBar = () => {
	return (
		<Box
			bgGradient="linear(to-r, blue.500, blue.300, blue.500)"
			color="gray.700"
		>
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
							bgColor="#F1F3F8"
						>
							نکست سوشال
						</Button>
					</Link>
					<Flex gap="3">
						<Link href={`/profile`} passHref>
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
