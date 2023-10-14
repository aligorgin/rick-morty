'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Search from '@/components/Search';

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

export default function Page() {
	const [data, setData] = useState<any>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		if (!hasMore) {
			return;
		}
		queryData(
			`query getDatafromPageNumber($pageNumber: Int) {
				characters(page: $pageNumber) {
				  info {
					count
					pages
					next
					prev
				  }
				  results {
					name
					image
					id
					status
					location{
					  name
					}
				  }
				}
			  }`,
			{
				pageNumber: page
			}
		).then((res) => {
			const newResults = res.data.characters.results;
			if (page === 1) {
				setData(newResults);
			} else {
				setData((prevState: []) => [...prevState, ...newResults]);
			}

			if (res.data.characters.info.next === null) {
				setHasMore(false);
			}
		});
	}, [page, hasMore]);

	const handleClick = () => {
		if (hasMore) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	if (data.length === 0) {
		return (
			<div className="mb-12">
				<div className="mt-12 text-center text-4xl font-bold">
					Rick and Morty Characters
				</div>
				<div className="mt-8 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-0	">
					{Array.from({ length: 10 }, (_, i) => (
						<div key={i} className="shimmer h-[300px] w-[350px]" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="mb-12">
			<div className="mt-12 px-4 text-center text-4xl font-bold">
				Rick and Morty Characters
			</div>
			<div className="my-8 flex items-center justify-center">
				<Search />
			</div>
			<div className="mt-8 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-0">
				{data &&
					data.map((result: any, index: number) => {
						return (
							<Card
								key={index}
								alt={result.name}
								imageUrl={result.image}
								location={result.location.name}
								name={result.name}
								status={result.status}
								id={result.id}
							/>
						);
					})}
			</div>
			<div className="mt-12 flex items-center justify-center">
				{hasMore && (
					<div
						onClick={handleClick}
						className="cursor-pointer rounded-md border border-zinc-600 px-4 py-2 text-xl transition hover:-translate-y-1 active:scale-95"
					>
						Load More
					</div>
				)}
			</div>
		</div>
	);
}
