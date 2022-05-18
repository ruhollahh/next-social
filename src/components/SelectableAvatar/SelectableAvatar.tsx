import { Avatar, Box, Flex, Input } from "@chakra-ui/react";
import { forwardRef } from "react";

export const SelectableAvatar = forwardRef<
	HTMLInputElement,
	{
		name: string;
		avatar: string | undefined;
		handleAvatarChange: (file: File) => void;
	}
>(({ name, avatar, handleAvatarChange }, ref) => {
	return (
		<Box
			pos="relative"
			w="fit-content"
			rounded="full"
			overflow="hidden"
			cursor="pointer"
			role="group"
			onClick={() => {
				if (ref && typeof ref !== "function") {
					ref.current?.click();
				}
			}}
		>
			<Avatar name={name} src={avatar} size="lg" />
			<Input
				ref={ref}
				pos="absolute"
				top="0"
				left="0"
				zIndex="hide"
				w="full"
				h="full"
				opacity="0"
				type="file"
				accept=".jpg, .jpeg, .png, .gif"
				onChange={(event) => {
					const files = event.target.files;

					if (files && files[0]) {
						const file = files[0];
						if (file.size > 5242880) {
							console.error("Image is bigger than 5MB");
							return;
						}
						handleAvatarChange(files[0]);
					}
				}}
			/>
			<Flex
				display="none"
				justify="center"
				align="center"
				pos="absolute"
				bottom="0"
				left="0"
				right="0"
				height="40%"
				bgColor="blackAlpha.700"
				color="gray.100"
				fontSize="12px"
				userSelect="none"
				_groupHover={{ display: "flex" }}
			>
				<span>تغییر</span>
			</Flex>
		</Box>
	);
});

SelectableAvatar.displayName = "SelectableAvatar";
