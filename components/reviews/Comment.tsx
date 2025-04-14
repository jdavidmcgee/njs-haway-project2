'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Comment({ comment }: { comment: string }) {
	const [isFullCommentShown, setIsFullCommentShown] = useState(false);

	const longComment = comment.length > 80;

	const toggleExpandedComment = () => {
		setIsFullCommentShown(!isFullCommentShown);
	};

	const displayComment =
		longComment && !isFullCommentShown
			? `${comment.slice(0, 80)}...`
			: `${comment}  `;

	return (
		<div>
			<p className="text-sm">{displayComment}</p>
			{longComment && (
				<Button
					variant="link"
					className="pl-0"
					onClick={toggleExpandedComment}>
					{isFullCommentShown ? 'Show less...' : 'Show more...'}
				</Button>
			)}
		</div>
	);
}
