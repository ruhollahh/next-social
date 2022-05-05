import { PageSpinner } from "@/components/PageSpinner";
import { SelectableAvatar } from "@/components/SelectableAvatar";
import { uploadImage } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";
import { Avatar, Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";

const ProfileEdit: NextPage = () => {
	const { data: profile, isLoading: isProfileLoading } = trpc.useQuery([
		"user.profile",
	]);
	const utils = trpc.useContext();
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [uploadedImage, setUploadedImage] = React.useState<string | undefined>(
		undefined
	);
	React.useEffect(() => {
		if (!isProfileLoading && profile?.image) {
			setUploadedImage(profile.image);
		}
	}, [isProfileLoading, profile?.image]);
	const uploadImageMutation = useMutation(
		(file: File) => {
			return uploadImage(file);
		},
		{
			onError: (error: any) => {
				console.error(`Error uploading image: ${error.message}`);
			},
		}
	);
	const updateUserProfileMutation = trpc.useMutation("user.edit", {
		async onSuccess() {
			await utils.invalidateQueries(["user.profile"]);
		},
	});
	const router = useRouter();
	const { userId } = router.query;
	if (!userId) {
		return <div>no id?</div>;
	}
	if (isProfileLoading) {
		return <PageSpinner />;
	}
	if (userId !== profile?.id) {
		return <div>Not Allowed!</div>;
	}
	return (
		<Flex direction="column" gap="5">
			<Heading>ویرایش پروفایل</Heading>
			<SelectableAvatar
				ref={fileInputRef}
				name={profile.name!}
				avatar={uploadedImage}
				handleAvatarChange={(file) =>
					setUploadedImage(URL.createObjectURL(file))
				}
			/>
			<Button
				color="gray.700"
				isLoading={
					updateUserProfileMutation.isLoading || uploadImageMutation.isLoading
				}
				onClick={async () => {
					if (profile.image === uploadedImage) {
						return;
					} else {
						const files = fileInputRef.current?.files;

						if (files && files[0]) {
							uploadImageMutation.mutate(files[0], {
								onSuccess: (uploadedImage) => {
									updateUserProfileMutation.mutate({
										id: profile.id,
										name: "Ruhollah",
										image: uploadedImage.url,
										about: "",
									});
								},
							});
						}
					}
				}}
			>
				ذخیره
			</Button>
		</Flex>
	);
};

export default ProfileEdit;
