'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Booking } from '@/utils/types';

const DynamicBookingWrapper = dynamic<{
	propertyId: string;
	price: number;
	bookings: Booking[];
}>(() => import('./BookingWrapper'), {
	ssr: false,
	loading: () => <Skeleton className="h-[200px] w-full" />,
});

interface ClientDynamicBookingWrapperProps {
	propertyId: string;
	price: number;
	bookings: Booking[];
}

export default function ClientDynamicBookingWrapper(
	props: ClientDynamicBookingWrapperProps
) {
	return <DynamicBookingWrapper {...props} />;
}
