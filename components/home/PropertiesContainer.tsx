import { fetchProperties } from '@/utils/actions';
import PropertiesList from './PropertiesList';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';
import Link from 'next/link';
import { Button } from '../ui/button';

export default async function PropertiesContainer({
	category,
	search,
}: {
	category?: string;
	search?: string;
}) {
	const properties: PropertyCardProps[] = await fetchProperties({
		category,
		search,
	});
	//console.log(`🙏 ~ properties:`, properties);

	if (properties.length === 0) {
		return (
			<EmptyList
				heading="No results..."
				message="Try changing or removing some of your filters."
				btnText="clear filters"
			/>
		);
	}
	return (
		<>
			<PropertiesList properties={properties} />
			{/* Render clear filters button only if a category or search input exists */}
			{(category || search) && (
				<div className="flex justify-center mt-4">
					<Button asChild className="capitalize mt-12" size="lg">
						<Link href="/">clear filters</Link>
					</Button>
				</div>
			)}
		</>
	);
}
