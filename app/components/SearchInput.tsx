'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
// import { useDebounce } from 'use-debounce'; // You might not have this package, so I'll write a simple debounced effect or manual submit

export default function SearchInput({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const [term, setTerm] = useState(initialQuery);
  // Simple debounce logic by waiting for user to stop typing or press enter? 
  // For simplicity and robustness without extra deps, let's use Form submission or pure change with timeout
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (term.trim()) {
          router.push(`/search?q=${encodeURIComponent(term.trim())}`);
      }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search for articles, topics, or keywords..."
        className="w-full px-6 py-4 pl-12 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none text-lg shadow-sm transition-colors text-black"
        autoFocus
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
      <button 
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-full font-bold hover:bg-accent transition-colors text-sm"
      >
        Search
      </button>
    </form>
  );
}
