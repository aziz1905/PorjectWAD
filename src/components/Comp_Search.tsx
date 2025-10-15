import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Buat Context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch harus digunakan di dalam SearchProvider');
  }
  return context;
};

// Buat Provider untuk membungkus aplikasi Anda
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const value = { searchTerm, setSearchTerm };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};


const Search = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center w-full">
      <div
        className="relative flex items-center w-full max-w-lg bg-blue-700 rounded-2xl"
        onClick={() => inputRef.current?.focus()}
        style={{ cursor: 'text' }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari kostum..."
          className="search-bar w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button aria-label="search" className="search-button">
          <Icon icon="mdi:magnify" className="text-white text-2xl mx-2.5" />
        </button>
      </div>
    </div>
  );
};

export default Search; 