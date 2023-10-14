import Character from './Character';

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

export async function generateMetadata({ params }: { params: { id: string } }) {
	const name = await queryData(
		`query searchCharacterById($characterId: ID!) {
		character(id: $characterId) {
		  name
		}
	  }
	  `,
		{
			characterId: parseInt(params.id)
		}
	);
	return {
		title: name ? name.data.character.name : 'Rick API'
	};
}

export default function Page({ params }: { params: { id: string } }) {
	return (
		<Character
			params={{
				id: params.id
			}}
		/>
	);
}
