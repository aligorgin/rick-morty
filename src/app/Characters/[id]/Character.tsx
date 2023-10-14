'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const queryData = async (query: string, variables: any) => {
	try {
		const response = await fetch('https://rickandmortyapi.com/graphql', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({
				query: query,
				variables: variables
			})
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

export default function Character({ params }: { params: { id: string } }) {
	const [data, setData] = useState<any>(null);
	const [loaded, setLoaded] = useState<boolean>(true);

	const handleImageLoad = () => {
		setLoaded(false);
	};

	useEffect(() => {
		queryData(
			`query searchCharacterById($characterId: ID!) {
				character(id: $characterId) {
				  id
				  name
				  image
				  status
				  species
				  gender
				  type
				  created
				  location {
					name
				  }
				}
			  }`,
			{
				characterId: parseInt(params.id)
			}
		).then((res) => {
			const result = res.data.character;
			setData(result);
		});
	}, [params.id]);

	console.log(data);

	if (!data) {
		return (
			<div className="mt-12 flex flex-col space-x-4 sm:flex-row">
				<div className="shimmer h-[400px] w-[250px] rounded-md" />
				<div className="flex flex-col items-center justify-center space-y-8">
					<div className="shimmer h-8 w-[300px] rounded-md" />
					<div className="shimmer h-12 w-[300px] rounded-md" />
					<div className="shimmer h-8 w-[300px] rounded-md" />
					<div className="shimmer h-4 w-[300px] rounded-md" />
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 sm:px-0">
			<div className="mt-12 text-center text-4xl font-bold">{data.name}</div>
			<div className="mt-8 flex flex-col space-x-8 sm:flex-row">
				<div className="relative h-[360px] w-full sm:w-1/2 ">
					{loaded && <div className="shimmer h-full w-full" />}
					<Image
						src={data.image}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="rounded-md object-cover"
						alt={data.name}
						priority
						onLoad={handleImageLoad}
					/>
				</div>

				<div className="mt-8 flex flex-col space-y-4 sm:mt-0">
					<div className="flex items-center space-x-1">
						<div>Status: </div>
						<div
							className={clsx('h-3 w-3 rounded-full', {
								'bg-green-500': data.status === 'Alive',
								'bg-red-500': data.status === 'Dead',
								'bg-zinc-400': data.status === 'unknown'
							})}
						/>
						<div>{data.status}</div>
					</div>
					<div>Species: {data.species}</div>
					{data.type === '' ? (
						<div className="hidden"></div>
					) : (
						<div>Type: {data.type}</div>
					)}
					<div>Gender: {data.gender}</div>
					<div>Location: {data.location.name}</div>
				</div>
			</div>
			<div className="mt-12 flex items-center justify-center">
				<Link
					href={'/rick'}
					className="flex cursor-pointer items-center justify-center space-x-2 rounded-md border border-zinc-600 px-4 py-2 text-xl transition hover:-translate-y-1 active:scale-95"
				>
					<ArrowLeftIcon className="h-6 w-6 " />
					<p>All Characters</p>
				</Link>
			</div>
		</div>
	);
}
