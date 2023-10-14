import { useState, ChangeEvent, useEffect } from 'react';
import useResultsStore from '@/store/useResultStore';

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

export default function Search() {
	const [char, setChar] = useState('');
	const { results, setResults, clearResults } = useResultsStore();

	useEffect(() => {
		if (char === '') return;
		queryData(
			` query GetCharactersByName($name: String!) {
                characters(filter: { name: $name }) {
                  results {
                    name
                    id
                    image
                    status
                  }
                }
              }`,
			{
				pageNumber: char
			}
		).then((res) => {
			const results = res.data.characters.results;
			setResults(results);
		});
	}, [char, setResults]);

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		setChar(e.target.value);
	};

	return (
		<div>
			<input
				className="w-[280px] rounded-md p-2 text-black transition focus:outline-none focus:ring focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black"
				placeholder="Character Name"
				type="text"
				onChange={handleOnChange}
			/>
		</div>
	);
}
