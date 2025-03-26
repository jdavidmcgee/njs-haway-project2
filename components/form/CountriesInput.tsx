import { Label } from '@/components/ui/label';
import { formattedCountries } from '@/utils/countries';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const name = 'country';

export default function CountriesInput({
	defaultValue,
}: {
	defaultValue?: string;
}) {
	// Compute the fallback value: if no defaultValue is provided,
	// try to use 'US' (if it exists in the formattedCountries array),
	// otherwise, fall back to the first country in the list.
	const fallbackValue =
		defaultValue ||
		formattedCountries.find(item => item.code === 'US')?.code ||
		formattedCountries[0].code;

	return (
		<div className="mb-2">
			<Label htmlFor={name} className="capitalize">
				country
			</Label>
			<Select defaultValue={fallbackValue} name={name} required>
				<SelectTrigger id={name}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{formattedCountries.map(item => {
						return (
							<SelectItem key={item.code} value={item.code}>
								<span className="flex items-center gap-2">
									{item.flag} {item.name}
								</span>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
