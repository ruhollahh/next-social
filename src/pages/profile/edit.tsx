import { PageSpinner } from "@/components/PageSpinner";
import { SelectableAvatar } from "@/components/SelectableAvatar";
import { uploadImage } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Text,
	Textarea,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import { useMutation } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	EditProfile,
	editProfileValidator,
} from "@/shared/editProfileValidator";
import { useRouter } from "next/router";

const ProfileEdit: NextPage = () => {
	const { data: profile, isLoading: isProfileLoading } = trpc.useQuery([
		"user.profile",
	]);
	const utils = trpc.useContext();
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [uploadedImage, setUploadedImage] = React.useState<string | undefined>(
		undefined
	);

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors },
	} = useForm<EditProfile>({
		resolver: zodResolver(editProfileValidator),
	});

	React.useEffect(() => {
		if (!isProfileLoading) {
			if (profile?.image) {
				setUploadedImage(profile.image);
			}
			if (profile?.name) {
				setValue("name", profile.name);
			}
			if (profile?.about) {
				setValue("about", profile.about);
			}
		}
	}, [
		isProfileLoading,
		profile?.about,
		profile?.image,
		profile?.name,
		setValue,
	]);
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
	const updateAvatarMutation = trpc.useMutation("user.updateAvatar", {
		async onSuccess() {
			await utils.invalidateQueries(["user.profile"]);
		},
	});
	const router = useRouter();
	const editProfileMutation = trpc.useMutation("user.edit", {
		async onSuccess() {
			await utils.invalidateQueries(["user.profile"]);
			router.push("/profile");
		},
	});

	if (isProfileLoading || !profile) {
		return <PageSpinner />;
	}
	const isUpdating =
		updateAvatarMutation.isLoading ||
		uploadImageMutation.isLoading ||
		editProfileMutation.isLoading;
	return (
		<Flex
			as="form"
			mx="auto"
			direction="column"
			gap="5"
			align="center"
			w="50%"
			pb="10"
			onSubmit={handleSubmit((data) => {
				if (profile.image !== uploadedImage) {
					const files = fileInputRef.current?.files;
					if (files && files[0]) {
						uploadImageMutation.mutate(files[0], {
							onSuccess: (uploadedImage) => {
								updateAvatarMutation.mutate(uploadedImage.url);
							},
						});
					}
				}
				editProfileMutation.mutate({
					name: data.name,
					about: data.about,
				});
			})}
		>
			<SelectableAvatar
				ref={fileInputRef}
				name={profile.name!}
				avatar={uploadedImage}
				handleAvatarChange={(file) =>
					setUploadedImage(URL.createObjectURL(file))
				}
			/>
			<FormControl isInvalid={Boolean(errors.name)}>
				<FormLabel htmlFor="name">نام</FormLabel>
				<Input id="name" {...register("name")} />
				{Boolean(errors.name) && (
					<Text pt="1" fontSize="small" color="red.400">
						{errors.name?.message}
					</Text>
				)}
			</FormControl>
			<FormControl isInvalid={Boolean(errors.about)}>
				<FormLabel htmlFor="about">درباره من</FormLabel>
				<Textarea id="about" {...register("about")} />
				{Boolean(errors.about) && (
					<Text pt="1" fontSize="small" color="red.400">
						{errors.about?.message}
					</Text>
				)}
			</FormControl>
			<Button color="gray.700" isLoading={isUpdating} type="submit">
				ذخیره
			</Button>
		</Flex>
	);
};

export default ProfileEdit;
