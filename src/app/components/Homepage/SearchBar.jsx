'use client';

import { useState } from 'react';
import '../../styles/homepage.css';
import { useRouter } from 'next/navigation';
const SearchBar = ({text}) => {
    const router=useRouter()
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', search);
    if (search.trim()) {
        router.push(`/search?q=${encodeURIComponent(search)}`);
      }
  };

  return (
    <div className='w-full h-full flex justify-center items-center'>
        <div className="homepage p-5">
          <h1 className="title">{text}</h1>
        <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by Album name or Artist name" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
        </div>
      </div>
    </div>
    
  );
};

export default SearchBar;
