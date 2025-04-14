import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Rating from './Rating';
import Comment from './Comment';
import Image from 'next/image';

type ReviewCardProps = {
	reviewInfo: {
		comment: string;
		rating: number;
		name: string;
		image: string;
	};
	children?: React.ReactNode;
};

export default function ReviewCard({ reviewInfo, children }: ReviewCardProps) {
	const { comment, rating, name, image } = reviewInfo;
	return (
		<Card className="relative">
			<CardHeader>
				<div className="flex items-center">
					<Image
						src={image}
						alt="profile"
						width={48}
						height={48}
						priority
						className="rounded-full object-cover"
					/>
					<div className="ml-4">
						<h3 className="text-sm font-bold capitalize mb-1">{name}</h3>
						<Rating rating={rating} />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Comment comment={comment} />
				{/* delete button */}
				<div className="absolute top-3 right-3">{children}</div>
			</CardContent>
		</Card>
	);
}
