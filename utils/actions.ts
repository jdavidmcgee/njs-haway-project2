'use server';

import {
	profileSchema,
	validateWithZodSchema,
	imageSchema,
	propertySchema,
} from './schemas';
import db from './db';
import { createClerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from './supabase';

// Initialize Clerk client
const clerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

// Helper functions... getAuthUser , renderError //

const getAuthUser = async () => {
	const user = await currentUser();
	if (!user) {
		throw new Error('You must be logged in to access this page');
	}
	if (!user.privateMetadata.hasProfile) {
		redirect('/profile/create');
	}
	return user;
};

const renderError = (error: unknown): { message: string } => {
	console.log('error:', error);
	//return { message: `${error.errors[0].message}` };
	return {
		message: error instanceof Error ? error.message : 'An error occurred',
	};
};

// Fetch functions... fetchProfileImage , fetchProfile, fetchProperties, fetchFavoriteId, fetchFavorites, fetchPropertyDetails //

export const fetchProfileImage = async () => {
	const user = await currentUser();
	if (!user) return null;

	const profile = await db.profile.findUnique({
		where: {
			clerkId: user.id,
		},
		select: {
			profileImage: true,
		},
	});

	return profile?.profileImage;
};

export const fetchProfile = async () => {
	const user = await getAuthUser();
	const profile = await db.profile.findUnique({
		where: {
			clerkId: user.id,
		},
	});
	if (!profile) {
		return redirect('/profile/create');
	}
	return profile;
};

export const fetchProperties = async ({
	search = '',
	category,
}: {
	search?: string;
	category?: string;
}) => {
	const properties = await db.property.findMany({
		where: {
			category,
			OR: [
				{ name: { contains: search, mode: 'insensitive' } },
				{ tagline: { contains: search, mode: 'insensitive' } },
			],
		},
		select: {
			image: true,
			id: true,
			name: true,
			tagline: true,
			country: true,
			price: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
	return properties;
};

export const fetchFavoriteId = async ({
	propertyId,
}: {
	propertyId: string;
}) => {
	const user = await getAuthUser();
	const favorite = await db.favorite.findFirst({
		where: {
			propertyId,
			profileId: user.id,
		},
		select: {
			id: true,
		},
	});
	return favorite?.id || null;
};

export const fetchFavorites = async () => {
	const user = await getAuthUser();
	const favorites = await db.favorite.findMany({
		where: {
			profileId: user.id,
		},
		select: {
			property: {
				select: {
					image: true,
					id: true,
					name: true,
					tagline: true,
					country: true,
					price: true,
				},
			},
		},
	});
	return favorites.map(favorite => favorite.property);
	//return favorites;
};

export const fetchPropertyDetails = async (id: string) => {
	return await db.property.findUnique({
		where: {
			id,
		},
		include: {
			profile: true,
		},
	});
};

// Actions... createProfileAction , updateProfileAction, updateProfileImageAction, createPropertyAction, toggleFavoriteAction  //

export const createProfileAction = async (
	prevState: unknown,
	formData: FormData
) => {
	try {
		const user = await currentUser();
		//console.log('user:', user);
		if (!user) throw new Error('Please log in to create a profile');
		const rawData = Object.fromEntries(formData);
		const validatedFields = validateWithZodSchema(profileSchema, rawData);
		//console.log('validatedFields:', validatedFields);
		await db.profile.create({
			data: {
				clerkId: user.id,
				email: user.emailAddresses[0].emailAddress,
				profileImage: user.imageUrl ?? '',
				...validatedFields,
			},
		});
		await clerkClient.users.updateUserMetadata(user.id, {
			privateMetadata: {
				hasProfile: true,
			},
		});
		//return { message: 'profile created' };
	} catch (error) {
		return renderError(error);
	}
	redirect('/');
};

export const updateProfileAction = async (
	prevState: unknown,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	try {
		const rawData = Object.fromEntries(formData);
		const validatedFields = validateWithZodSchema(profileSchema, rawData);

		await db.profile.update({
			where: {
				clerkId: user.id,
			},
			data: validatedFields,
		});
		// Revalidate the profile page
		revalidatePath('/profile');
		return { message: 'profile updated' };
	} catch (error) {
		return renderError(error);
	}
};

export const updateProfileImageAction = async (
	prevState: unknown,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();

	try {
		const image = formData.get('image') as File;
		const validatedFields = validateWithZodSchema(imageSchema, { image });
		const fullPath = await uploadImage(validatedFields.image);

		await db.profile.update({
			where: {
				clerkId: user.id,
			},
			data: {
				profileImage: fullPath,
			},
		});
		revalidatePath('/profile');

		return { message: 'Profile image updated successfully' };
	} catch (error) {
		return renderError(error);
	}
};

export const createPropertyAction = async (
	prevState: unknown,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();

	try {
		const rawData = Object.fromEntries(formData);
		const imageFile = formData.get('image') as File;
		const validatedFields = validateWithZodSchema(propertySchema, rawData);
		const validatedImageFile = validateWithZodSchema(imageSchema, {
			image: imageFile,
		});

		// upload the image to supabase
		const fullPath = await uploadImage(validatedImageFile.image);
		// create the property
		await db.property.create({
			data: {
				...validatedFields,
				image: fullPath,
				profileId: user.id,
			},
		});

		//return { message: 'Property created successfully' };
	} catch (error) {
		return renderError(error);
	}
	redirect('/');
};

export const toggleFavoriteAction = async (prevState: {
	propertyId: string;
	favoriteId: string | null;
	pathname: string;
}) => {
	const user = await getAuthUser();
	const { propertyId, favoriteId, pathname } = prevState;
	//console.log('prevState: ', propertyId, favoriteId, pathname);
	try {
		if (favoriteId) {
			await db.favorite.delete({
				where: {
					id: favoriteId,
				},
			});
		} else {
			await db.favorite.create({
				data: {
					propertyId,
					profileId: user.id,
				},
			});
		}
		revalidatePath(pathname);
		return {
			message: favoriteId ? 'Removed from Favorites' : 'Added to Favorites',
		};
	} catch (error) {
		return renderError(error);
	}
};

