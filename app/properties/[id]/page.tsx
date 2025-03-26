import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import BookingCalendar from '@/components/properties/BookingCalendar';
import PropertyRating from '@/components/card/PropertyRating';
import BreadCrumbs from '@/components/properties/BreadCrumbs';
import ImageContainer from '@/components/properties/ImageContainer';
import ShareButton from '@/components/properties/ShareButton';
import { Separator } from '@/components/ui/separator';
import { fetchPropertyDetails } from '@/utils/actions';
import { redirect } from 'next/navigation';
import PropertyDetails from '@/components/properties/PropertyDetails';
import UserInfo from '@/components/properties/UserInfo';
import Description from '@/components/properties/Description';
import Amenities from '@/components/properties/Amenities';
import ClientDynamicMap from '@/components/properties/ClientDynamicMap';


export default async function PropertyDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await Promise.resolve(params); // Await params before using it
	const property = await fetchPropertyDetails(id);
	//console.log(`🙏 ~ property:`, property);
	if (!property) redirect('/');
	const { baths, bedrooms, guests, beds } = property;
	const details = { baths, bedrooms, guests, beds };

	const firstName = property.profile.firstName;
	const profileImage = property.profile.profileImage;
	return (
		<section>
			<BreadCrumbs name={property.name} />
			<header className="flex justify-between items-center mt-4">
				<h1 className="text-4xl font-bold capitalize">
					{property.tagline}
				</h1>
				<div className="flex items-center gap-x-4">
					{/* share button */}
					<ShareButton name={property.name} propertyId={property.id} />
					{/* favorite toggle button */}
					<FavoriteToggleButton propertyId={property.id} />
				</div>
			</header>
			{/* image */}
			<ImageContainer mainImage={property.image} name={property.name} />
			{/* details within a multi-column layout */}
			<section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
				<div className="lg:col-span-8">
					<div className="flex gap-x-4 items-center">
						<h1 className="text-xl font-bold">{property.name}</h1>
						<PropertyRating inPage propertyId={property.id} />
					</div>
					{/* property details */}
					<PropertyDetails details={details} />
					{/* user information */}
					<UserInfo profile={{ profileImage, firstName }} />
					{/* add a separator */}
					<Separator className="mt-4" />
					{/* add the description */}
					<Description description={property.description} />
					{/* add amenities */}
					<Amenities amenities={property.amenities} />
					{/* property map */}
					<ClientDynamicMap countryCode={property.country} />
				</div>
				<div className="lg:col-span-4 flex flex-col items-center">
					<h3 className="text-lg font-bold mb-2">Booking Calendar</h3>
					<p className="text-sm text-center">
						Select start and end dates to book property
					</p>
					{/* calendar will be placed here */}
					<BookingCalendar />
				</div>
			</section>
		</section>
	);
}
