import { useState } from 'react'

import styles from './Searchbar.module.css'

import { Search } from 'lucide-react'

export const Searchbar = (onSearch, onLocationSearch, loading) => {

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  

  return (
    <>
        <div className={styles['search-bar']} >

            <Search size={16} />

            <input value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for cities....'
            />

        </div>
    </>
  )
}
