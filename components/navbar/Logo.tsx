import Link from 'next/link';
import { FaDove } from 'react-icons/fa6';

import { Button } from '../ui/button';

export default function Logo() {
	return (
		<Button size="icon" asChild>
			<Link href="/">
				<FaDove className="w-6 h-6" />
			</Link>
		</Button>
	);
}
