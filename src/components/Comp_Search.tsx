import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function Search() {
    // State untuk search bar
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center">
    
    <div
      className="relative flex items-center w-full max-w-lg bg-blue-700 rounded-2xl"
      onClick={() => {
        inputRef.current?.focus();
      }}
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
  )
}

