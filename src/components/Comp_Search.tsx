import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';


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
    <NavLink to="/beranda#produk" style={{ display: 'block' }}>
    <div className="flex items-center w-full">
      <div
        className="relative flex items-center w-full max-w-lg bg-blue-600 rounded-2xl"
        onClick={() => inputRef.current?.focus()}
        style={{ cursor: 'text' }}
      >
        
        <input
          onClick={<NavLink to="/beranda#produk" style={{ display: 'botom' }} />}
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
  </NavLink>
  );
};

export default Search; 