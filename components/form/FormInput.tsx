import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormInputProps = {
	name: string;
	type: string;
	label?: string;
	defaultValue?: string;
	placeholder?: string;
};

export default function FormInput(props: FormInputProps) {
	const { label, name, type, defaultValue, placeholder } = props;
	return (
		<div className="mb-4">
			<Label htmlFor={name} className="capitalize">
				{label || name}
			</Label>
			<Input
				type={type}
				name={name}
				id={name}
				placeholder={placeholder}
				defaultValue={defaultValue}
				required
			/>
		</div>
	);
}
