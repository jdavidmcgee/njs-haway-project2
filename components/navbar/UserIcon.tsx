import { LuUser } from 'react-icons/lu';
import { fetchProfileImage } from '@/utils/actions';
import Image from 'next/image';

export default async function UserIcon() {
	const profileImage = await fetchProfileImage();
	if (profileImage) {
		return (
			<Image
				src={profileImage}
				width={24}
				height={24}
				className="rounded-full object-cover"
				alt="Profile Image"
			/>
		);
	}
	return <LuUser className="w-6 h-6 bg-primary rounded-full text-white" />;
}
