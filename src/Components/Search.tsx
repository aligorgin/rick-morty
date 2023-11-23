import { ChangeEvent, useEffect } from 'react';
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
	const { setResults, clearResults, charName, setCharName, setIsDebounced } = useResultsStore();

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCharName(e.target.value);
	};

	useEffect(() => {
		setIsDebounced(false);
		if (charName === '') {
			clearResults();
			return;
		};
		const timer = setTimeout(() => {
			queryData(
				` query GetCharactersByName($name: String!) {
					characters(filter: { name: $name }) {
					  results {
						name
						id
						image
						status
						location{
							name
						}
					  }
					}
				  }`,
				{
					name: charName
				}
			).then((res) => {
				const results = res.data.characters.results;
				setResults(results)
				setIsDebounced(true);
			}).catch((e) => {
				console.log(e)
			});
		}, 500)

		return () => clearTimeout(timer);
	}, [charName, clearResults, setIsDebounced, setResults]);

	return (
		<div>
			<input
				className="w-[280px] rounded-md p-2 text-black transition focus:outline-none focus:ring focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black"
				placeholder="Character Name"
				type="text"
				onChange={handleOnChange}
				max="30"
			/>
		</div>
	);
}
