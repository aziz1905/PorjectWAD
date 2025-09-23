import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function Search() {
    // State untuk search bar
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center">
    
    <div
      className="rounded-2xl bg-blue-900 relative flex w-full max-w-lg "
      onClick={() => {
        inputRef.current?.focus();
      }}
      style={{ cursor: 'text' }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari kostum..."
        className="search-bar flex-1 "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      <button aria-label="search" className="cursor-pointer">
        <Icon icon="mdi:magnify" className="text-white text-2xl mx-2.5" />
      </button>
    </div>
  </div>
  )
}

