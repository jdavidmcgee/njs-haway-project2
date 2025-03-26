'use client';

import React, { Suspense } from 'react';

export default function NotFound() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NotFoundContent />
		</Suspense>
	);
}

function NotFoundContent() {
	return (
		<div style={{ textAlign: 'center', padding: '2rem' }}>
			<h1>404 - Page Not Found</h1>
			<p>Sorry, we could not find the page you are looking for.</p>
		</div>
	);
}
