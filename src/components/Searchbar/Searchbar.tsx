import { useEffect, useRef, useState } from 'react'

import styles from './Searchbar.module.css'
import { Search } from 'lucide-react'
import { searchCities } from '../Services/WeatherAPI';

interface SearchbarProps {
  onSearch: (query: string) => void;
  onLocationSearch: () => void;
  loading: boolean;
}

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export const Searchbar: React.FC<SearchbarProps> = ({ onSearch, onLocationSearch, loading }) => {

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {

      if (searchRef.current && 
        event.target instanceof Node &&
        !searchRef.current.contains(event.target)) {

        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    
    const searchTimeout = setTimeout(async () => {

      if (query.length > 2) {

        setSearchLoading(true);

        try {
          const result = await searchCities(query);

          setSuggestions(result);
          setShowSuggestions(true);

        }
        catch (error) {

          console.error('Error searching cities:', error);
        
        }
        finally {

          setSearchLoading(false);
        
        }

      }
      else {

        setSuggestions([]);
        setShowSuggestions(false);

      }
    }, 300);

    return () => clearTimeout(searchTimeout);

  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  const handleSuggestionClick = (city: City) => {
    const cityName = city.name ? `${city.name}, ${city.country}` : city.name;
    setQuery(cityName);
    setQuery('');
    setShowSuggestions(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  return (
    <>
        <div ref={searchRef} className={styles['search-bar']} >
          <form>
            <div>
              <Search size={16} />

              <input 
                type="text" 
                value={query}
                onChange={handleChange}
                placeholder='Search for cities....'
              />

            </div>
          </form>
            
        </div>
    </>
  )
}
