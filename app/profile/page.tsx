import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';
import {
	updateProfileAction,
	fetchProfile,
	updateProfileImageAction,
} from '@/utils/actions';
import ImageInputContainer from '@/components/form/ImageInputContainer';

export default async function ProfilePage() {
	const { firstName, lastName, username, profileImage } = await fetchProfile();
	return (
		<section>
			<h1 className="text-2xl font-semibold mb-8 capitalize">
				user profile
			</h1>
			<div className="border p-8 rounded-md">
				<ImageInputContainer
					image={profileImage}
					name={username}
					action={updateProfileImageAction}
					text="Update Profile Image"
				/>
				<FormContainer action={updateProfileAction}>
					<div className="grid md:grid-cols-2 gap-4 mt-4">
						<FormInput
							name="firstName"
							type="text"
							label="First Name"
							defaultValue={firstName}
						/>
						<FormInput
							name="lastName"
							type="text"
							label="Last Name"
							defaultValue={lastName}
						/>
						<FormInput
							name="username"
							type="text"
							label="Username"
							defaultValue={username}
						/>
					</div>

					<SubmitButton text="Update Profile" className="mt-8" />
				</FormContainer>
			</div>
		</section>
	);
}
