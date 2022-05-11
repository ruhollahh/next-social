import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	ModalProps,
} from "@chakra-ui/react";
import { ReactElement } from "react";

export const BasicModal = ({
	children,
	...rest
}: ModalProps & { children: ReactElement }) => {
	return (
		<Modal size="3xl" {...rest}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton color="gray.700" />
				<ModalBody rounded="md" pt="10" bgColor="#F1F3F8">
					{children}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
