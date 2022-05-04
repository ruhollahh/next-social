import { PageSpinner } from "@/components/PageSpinner";
import { uploadImage } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";
import { Avatar, Button, Flex, Heading } from "@chakra-ui/react";
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
	const [uploadedImage, setUploadedImage] = React.useState<
		null | string | undefined
	>();
	React.useEffect(() => {
		if (!isProfileLoading) {
			setUploadedImage(profile?.image);
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
		onSuccess() {
			utils.invalidateQueries(["user.profile"]);
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
			<Heading>Edit Profile</Heading>
			<Avatar name={profile.name!} src={uploadedImage!} />
			<input
				ref={fileInputRef}
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
						setUploadedImage(URL.createObjectURL(files[0]));
					}
				}}
			/>
			<Button
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
