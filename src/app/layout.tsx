import clsx from 'clsx';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Rick and Morty',
	description: 'Rick and Morty Characters'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={clsx(inter.className, 'mx-auto max-w-3xl')}>{children}</body>
		</html>
	);
}
