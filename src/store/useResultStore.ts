import { create } from "zustand";

interface ResultsStore {
  results: string[];
  setResults: (newResults: string[]) => void;
  clearResults: () => void;
}

const useResultsStore = create<ResultsStore>((set) => ({
  results: [],

  setResults: (newResults) => set({ results: newResults }),

  clearResults: () => set({ results: [] }),
}));

export default useResultsStore;
