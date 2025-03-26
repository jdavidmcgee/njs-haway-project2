'use server';

import { profileSchema } from './schemas';
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createProfileAction = async (
	prevState: unknown,
	formData: FormData
) => {
	try {
		const user = await currentUser();
		//console.log('user:', user);
		if (!user) throw new Error('Please log in to create a profile');
		const rawData = Object.fromEntries(formData);
		const validatedFields = profileSchema.parse(rawData);
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
		console.log('error:', error);
		//return { message: `${error.errors[0].message}` };
		return {
			message: error instanceof Error ? error.message : 'An error occurred',
		};
	}
	redirect('/');
};


