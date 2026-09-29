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

// props required by the searchbar component
interface SearchbarProps {
  
  // runs when the user searches for a city.
  onSearch: (query: string) => void;

  // runs when the user requests weather
  // for their current location.
  onLocationSearch: () => void;

  // indicates whether a weather request is in progress.
  loading: boolean;
}

// represents one city returned by the search API.
interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

// search input with city suggestions
// and current-locaton search.
export const Searchbar: React.FC<SearchbarProps> = ({ 

  onSearch, 
  onLocationSearch, 
  loading 

}) => {

  // stores the text currently types into the serch field.
  const [query, setQuery] = 
    useState('');

  // stores cit suggestions returned by the API.
  const [suggestions, setSuggestions] =   
    useState<City[]>([]);

  // controls whther the suggestion dropdown is visible.
  const [showSuggestions, setShowSuggestions] = 
    useState(false);

  // tracks whther city suggestions are currently loading
  const [searchLoading, setSearchLoading] = useState(false);
  
  // reference to the entire search component
  // used to detct clicks outside of the search area
  const searchRef = 
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    // close the suggestion dropdown when
    // the user clicks outside the search component.
    const handleClickOutside = (

      event: MouseEvent

    ) => {

      if (
        searchRef.current && 
        event.target instanceof Node &&
        !searchRef.current.contains(event.target)

      ) {
        setShowSuggestions(false);
      }
    };

    // listen for mouse clicks anywhere on the page
    document.addEventListener(
      
      'mousedown', 
      handleClickOutside

    );

    // remove the listener when the component unmounts
    return () => {
      document.removeEventListener(
        
        'mousedown', 
        handleClickOutside
      
      );

    };

  }, []);

  useEffect(() => {
    
    // dela the city search slightly so the API
    // is not called after every single keystroke.
    const searchTimeout = setTimeout(async () => {

      // only search when at least
      // three character have been entered.
      if (query.length > 2) {

        setSearchLoading(true);

        try {

          // search for matching cities
          const result = 
            await searchCities(query);

          // store and display the returned suggestions.
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

        // clear suggestions when the query
        // is too short to search
        setSuggestions([]);
        setShowSuggestions(false);

      }

      // wait 300ms after the user stops typing.
    }, 300);

    // cancel the previus scheduled search
    // when the query changes again.
    return () => 
      clearTimeout(searchTimeout);

  }, [query]);

  // handles submitting the search form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    // prevent the browser from refresshing the page.
    e.preventDefault();

    // ignore empty or from refreshing the page.
    if (query.trim()) {
      onSearch(query.trim());

      // reset the search UI after submission.
      setQuery('');
      setShowSuggestions(false);
    }

  };


  // clears the current search and suggestion list.
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  // runs when the user chooses on of 
  // the suggeste cities.
  const handleSuggestionClick = (

    city: City

  ) => {

    onSearch(city.name);

    // reset the search after choosing a city
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);

  };

  // updates the serch query whenever
  // the user types into the input.
  const handleChange = (

    e: React.ChangeEvent<HTMLInputElement>

  ) => {

    setQuery(e.target.value);

  };

  return (
    <>
        <div ref={searchRef} className={styles['searchbar-wrapper']}>

          <form onSubmit={handleSubmit}>

            <div className={styles['search-bar']}>

              {/* search icon */}
              <Search size={16} />

              {/* city search input */}
              <input 
                type="text" 
                value={query}
                onChange={handleChange}
                placeholder='Search for cities....'
              />

              {/* show the clear button only when text exists. */}
              {
                query && (
                  <button 
                    type="button"
                    onClick={clearSearch} 
                    className={styles['clear-button']}
                  >

                    <X size={16} />

                  </button>
                )
              }

              {/* search using the user's current location. */}
              <button 
                className={styles['location-button']} 
                type="button" 
                disabled={loading}
                onClick={onLocationSearch} 
              >

                <MapPin size={16}/>

              </button>

            </div>
            
          </form>

          {/* display the suggeston dropdown when needed. */}
          {showSuggestions && (suggestions.length > 0 || searchLoading) && (

            <div className={styles['suggestions-container']}>

             
              {
                searchLoading 
                
                // show a loading state while city 
                // suggestions are being fetched.
                ? (
                    <div className={styles['suggestion-item']}>

                      <div className={styles['loading-indicator']}>

                        <Loader2 size={16} className={styles['spinner']} />

                        <Text 
                          variant='p'
                        >
                          Searching for cities....
                        </Text>

                      </div>

                    </div>

                  ) 
                  
                  // display the returned city suggestion
                  : (
                    suggestions.map((city, index) => {
                      return (

                        <button 
                          className={styles['suggestion-item']} 
                          key={`${city.name}-${city.country}-${index}`}
                          onClick={() => handleSuggestionClick(city)}
                        >

                          <div className={styles['suggestion-info']}>

                            <div className={styles['suggestion-text']}>

                              {city.name}

                              {/* display the state/region when available */}
                              {
                                city.state && 
                                <Text variant='span' 
                                  className={styles['suggestion-state']}>
                                  , {city.state}
                                </Text>
                              }
                            
                            </div>

                            {/* country code/name */}
                            <div 
                              className={styles['suggestion-country']}
                            >

                              {city.country}

                            </div>
                          </div>

                          <ChevronRight 
                            size={16} 
                            className={styles['suggestion-chevron']}
                          />

                        </button>

                      );

                    }

                  )

                )

              }

            </div>
          )}

        </div>

    </>

  );

}
