import React, { useState } from 'react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { SearchIcon } from 'lucide-react';

interface SearchProps {
  onSearchResult: (isItRaining: boolean) => void;
  onError: (error: string) => void;
  setCityHome: (cityHome: string) => void;
}

export default function Search({ onSearchResult, onError, setCityHome }: SearchProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [city, setCity] = useState('');

  const handleMouseEnter = () => {
    setIsHovered(true);
    gsap.to('.search-container', { width: '200px', duration: 0.3, ease: 'back.out' });
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      setIsHovered(false);
      gsap.to('.search-container', { width: '40px', duration: 0.3, ease: 'power1.out' });
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsHovered(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsHovered(false);
    gsap.to('.search-container', { width: '40px', duration: 0.3 });
  };

  const handleSearch = async () => {
    try {
      setCityHome(city);
      const response = await fetch(`/api/open-weather?city=${city}`);
      const data = await response.json();

      if (response.ok) {
        const isRaining = data.weather.some((condition: { main: string }) => condition.main === 'Rain');
        onSearchResult(isRaining);
        
      } else {
        onError(data.message || 'Erreur lors de la récupération des données météo.');
      }
    } catch (err) {
      onError(`Erreur de requête : ${(err as Error).message}`);
    }
  };

  return (
    <div
      className='absolute bottom-2 right-1/2 translate-x-1/2 rounded-full border border-gray-200 p-2 w-fit flex items-center search-container overflow-hidden'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx('flex items-center justify-center')}>
        <SearchIcon size={18} onClick={handleSearch} />
      </div>
      {(isHovered || isFocused) && (
        <input
          type='text'
          value={city}
          placeholder='Paris'
          className='ml-2 w-full h-full border-none outline-none'
          onChange={(e) => setCity(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      )}
    </div>
  );
}
