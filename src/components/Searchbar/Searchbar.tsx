import { useEffect, useRef, useState } from 'react'

import styles from './Searchbar.module.css'
import { Text } from '../Text/Text';

import { 
  Search, 
  X,
  MapPin,
  Loader2,
  ChevronRight,
} from 'lucide-react'

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    onSearch(city.name);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  return (
    <>
        <div ref={searchRef} className={styles['searchbar-wrapper']}>

          <form onSubmit={handleSubmit}>

            <div className={styles['search-bar']}>

              <Search size={16} />

              <input 
                type="text" 
                value={query}
                onChange={handleChange}
                placeholder='Search for cities....'
              />

              {/*Conditional rendering */}
              {query && (
                <button 
                  type="button"
                  onClick={clearSearch} 
                  className={styles['clear-button']}>

                  <X size={16} />

                </button>
              )}

              <button 
                className={styles['location-button']} 
                type="button" 
                disabled={loading}
                
                >
                <MapPin 
                  size={16} 
                  onClick={onLocationSearch} 
                />

              </button>
            </div>
          </form>

          {/*conditional redering for suggestions */}
          {showSuggestions && (suggestions.length > 0 || searchLoading) && (

            <div className={styles['suggestions-container']}>

              {/*conditional rendering */}
              {
                searchLoading ? (
                <div className={styles['suggestion-item']}>

                  <div className={styles['loading-indicator']}>

                    <Loader2 size={16} className={styles['spinner']} />
                    <Text variant='p'>Search for cities....</Text>

                  </div>

                </div>) : (
                  suggestions.map((city, index) => {
                    return (

                      <button 
                        className={styles['suggestion-item']} 
                        key={`${city.name}-${city.country}-${index}`}
                        onClick={() => handleSuggestionClick(city)}>

                        <div className={styles['suggestion-info']}>

                          <div className={styles['suggestion-text']}>

                            {city.name}

                            {/*conditional rendering */}
                            {
                              city.state && 
                              <Text variant='span' 
                                className={styles['suggestion-state']}>
                                , {city.state}'
                              </Text>
                            }
                           
                          </div>

                          <div className={styles['suggestion-country']}>{city.country}</div>
                        </div>

                        <ChevronRight size={16} className={styles['suggestion-chevron']}/>

                      </button>
                    );
                  })
              )}
            </div>
          )}
        </div>
    </>
  )
}
