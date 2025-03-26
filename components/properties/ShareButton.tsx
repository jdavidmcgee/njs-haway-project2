'use client';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { LuShare } from 'react-icons/lu';

import {
	TwitterShareButton,
	EmailShareButton,
	LinkedinShareButton,
	FacebookShareButton,
	TwitterIcon,
	EmailIcon,
	LinkedinIcon,
	FacebookIcon,
} from 'react-share';

export default function ShareButton({
	propertyId,
	name,
}: {
	propertyId: string;
	name: string;
}) {
	const url = process.env.NEXT_PUBLIC_WEBSITE_URL;
	const shareLink = `${url}/properties/${propertyId}`;
	const shareButtons = [
		{
			component: EmailShareButton,
			icon: EmailIcon,
			socialName: 'Email',
		},
		{
			component: TwitterShareButton,
			icon: TwitterIcon,
			socialName: 'Twitter',
		},
		{
			component: LinkedinShareButton,
			icon: LinkedinIcon,
			socialName: 'LinkedIn',
		},
		{
			component: FacebookShareButton,
			icon: FacebookIcon,
			socialName: 'Facebook',
		},
	];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon" className="p-2">
					<LuShare />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				align="end"
				sideOffset={10}
				className="flex items-center gap-x-2 justify-center w-full">
				{shareButtons.map(
					({
						component: ShareButtonComponent,
						icon: Icon,
						socialName,
					}) => (
						<ShareButtonComponent
							key={socialName}
							url={shareLink}
							title={name}>
							<Icon size={32} round />
						</ShareButtonComponent>
					)
				)}
			</PopoverContent>
		</Popover>
	);
}
