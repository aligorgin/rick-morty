import { create } from 'zustand';

interface ResultsStore {
	charName: string;
	isDebounced: boolean;
	results: string[];
	setCharName: (newCharName: string) => void;
	setResults: (newResults: string[]) => void;
	setIsDebounced: (newIsDebounced: boolean) => void;
	clearResults: () => void;
}

const useResultsStore = create<ResultsStore>((set) => ({
	charName: '',
	isDebounced: false,
	setIsDebounced: (newIsDebounced) => set({ isDebounced: newIsDebounced }),
	setCharName: (newCharName) => set({ charName: newCharName }),
	results: [],
	setResults: (newResults) => set({ results: newResults }),
	clearResults: () => set({ results: [] })
}));

export default useResultsStore;
