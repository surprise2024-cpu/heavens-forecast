import { useState } from 'react'

import styles from './Searchbar.module.css'

import { Search } from 'lucide-react'

export const Searchbar = () => {

    const [query, setQuery] = useState('');

  return (
    <>
        <div className={styles['search-bar']} >

            <Search size={16} />

            <input value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for cities'
            />

        </div>
    </>
  )
}
