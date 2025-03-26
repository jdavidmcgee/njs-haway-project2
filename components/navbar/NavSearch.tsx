'use client';
import { Input } from '../ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

export default function NavSearch() {
	const searchParamsFromHook = useSearchParams();
	// use a fallback if searchParams is null
	const searchParams = searchParamsFromHook || new URLSearchParams();
	
	const pathname = usePathname();
	const { replace } = useRouter();

	const [search, setSearch] = useState(
		searchParams.get('search')?.toString() || ''
	);

	const handleSearch = useDebouncedCallback((value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set('search', value);
		} else {
			params.delete('search');
		}
		replace(`${pathname}?${params.toString()}`);
	}, 500);

	const currentSearch = searchParams.get('search');

	useEffect(() => {
		if (!currentSearch) {
			setSearch('');
		}
	}, [currentSearch]);

	return (
		<Input
			type="text"
			placeholder="find a property"
			className="sm:max-w-xs dark:bg-muted"
			value={search}
			onChange={event => {
				setSearch(event.target.value);
				handleSearch(event.target.value);
			}}
		/>
	);
}
