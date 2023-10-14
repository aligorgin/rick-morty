import clsx from 'clsx';
import { useState } from 'react';
import Image from 'next/image';
import { MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Props {
	status: string;
	imageUrl: string;
	alt: string;
	name: string;
	location: string;
	id: string;
}

export default function Card({ status, imageUrl, alt, name, location, id }: Props) {
	const [loaded, setLoaded] = useState<boolean>(true);

	const handleImageLoad = () => {
		setLoaded(false);
	};

	return (
		<Link href={`rick/characters/${id}`}>
			<div className="relative cursor-pointer rounded-md bg-zinc-800 shadow-2xl shadow-white/10 transition hover:scale-105">
				<div className="absolute left-2 top-1 z-10 flex items-center justify-center space-x-1 rounded-lg bg-zinc-800/70 p-1 backdrop-blur-md">
					<div
						className={clsx('h-3 w-3 rounded-full', {
							'bg-green-500': status === 'Alive',
							'bg-red-500': status === 'Dead',
							'bg-zinc-400': status === 'unknown'
						})}
					/>
					<div>{status}</div>
				</div>
				<div className="relative h-[260px] w-full">
					{loaded && <div className="shimmer h-full w-full" />}
					<Image
						src={`${imageUrl}`}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="rounded-tl-md rounded-tr-md object-cover"
						alt={alt}
						priority
						onLoad={handleImageLoad}
					/>
				</div>
				<div className="flex flex-col space-y-4 p-2">
					<div className="text-2xl font-semibold">{name}</div>
					<div className="flex space-x-2 pb-2">
						<MapPinIcon className="h-6 w-6" />
						<div>{location}</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
