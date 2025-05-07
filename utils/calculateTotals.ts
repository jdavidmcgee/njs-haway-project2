import { calculateDaysBetween } from '@/utils/calendar';

type BookingDetails = {
	checkIn: Date;
	checkOut: Date;
	price: number;
};

export const calculateTotals = ({
	checkIn,
	checkOut,
	price,
}: BookingDetails) => {
	const totalNights = calculateDaysBetween({ checkIn, checkOut });
	const totalBeforeFeesAndTaxes = totalNights * price;
	const cleaningFee = 50;
	const serviceFee = totalBeforeFeesAndTaxes * 0.1;
	const tax = totalBeforeFeesAndTaxes * 0.05;
	const totalPriceOfStay = totalBeforeFeesAndTaxes + cleaningFee + serviceFee + tax;
	return {
		totalNights,
		totalBeforeFeesAndTaxes,
		cleaningFee,
		serviceFee,
		tax,
		totalPriceOfStay,
	};
};
