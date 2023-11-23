'use client';

import Card from '@/components/Card';
import Search from '@/components/Search';
import useResultsStore from '@/store/useResultStore';
import { useEffect, useState } from 'react';

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
	const { results, charName, isDebounced } = useResultsStore();


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
		}).catch((e) => {
			console.log(e)
		});;

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
				{data && results.length === 0 && charName === '' &&
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
				{
					results.length >= 1 && results.map((result: any, index: number) => {
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
					})
				}
			</div>
			{
				results.length === 0 && charName && isDebounced && (
					<div className=' flex justify-center items-center '>
						<div className='p-2 bg-red-500 w-[300px] font-semibold rounded-md flex justify-center items-center'>We couldn&apos;t find {`'${charName}'`}</div>
					</div>
				)
			}
			{
				results.length === 0 && charName && !isDebounced && (
					<div className='flex justify-center items-center'>
						<div className='p-2 bg-white w-[300px] text-black font-semibold rounded-md flex items-center justify-center '>Searching...</div>
					</div>
				)
			}
			<div className="mt-12 flex items-center justify-center">
				{hasMore && results.length === 0 && charName === '' && (
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
