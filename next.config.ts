import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
				pathname: '**', // Matches all paths under img.clerk.com
			},
			{
				protocol: 'https',
				hostname: 'ventszlzbimeydosudwq.supabase.co',
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb', // Adjust this value as needed (e.g., '2mb', '10mb', etc.)
		},
	},
};

export default nextConfig;
