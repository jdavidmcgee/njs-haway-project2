'use client';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { useProperty } from '@/utils/store';

import {
	generateDisabledDates,
	generateDateRange,
	defaultSelected,
	generateBlockedPeriods,
} from '@/utils/calendar';

export default function BookingCalendar() {
	const { toast } = useToast();
	
	// only runs once on mount → currentDate stays the same object
	const currentDate = useMemo(() => new Date(), []);

	const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

	const bookings = useProperty(state => state.bookings);
	
	// 1. Memoize blockedPeriods so it only recalculates when bookings or today change
	const blockedPeriods = useMemo(
		() => generateBlockedPeriods({ bookings, today: currentDate }),
		[bookings, currentDate]
	);

	// 2. Memoize unavailableDates so it only recalculates when blockedPeriods changes
	const unavailableDates = useMemo(
		() => generateDisabledDates(blockedPeriods),
		[blockedPeriods]
	);

	// 3. Now your effect can depend on both range & unavailableDates safely
	useEffect(() => {
		const selectedRange = generateDateRange(range);
		selectedRange.some(date => {
			if (unavailableDates[date]) {
				setRange(defaultSelected);
				toast({
					description: 'Some dates are booked. Please select again.',
				});
				return true;
			}
			return false;
		});
		useProperty.setState({ range });
	}, [range, unavailableDates, toast]);


	return (
		<Calendar
			mode="range"
			defaultMonth={currentDate}
			selected={range}
			onSelect={setRange}
			className="mb-4"
			disabled={blockedPeriods}
		/>
	);
}
