import { Bookmark } from 'lucide-react';
import React from 'react'

import styles from './SaveLocationButton.module.css'
import { Text } from '../Text/Text';

// props required by the saveLocationButton component.
interface SaveLocationButtonProps {

  // indicates whether the current location
  // has already been saved.
  saved: boolean;

  // function that adds or removes the location
  // when the buttonis clicked.
  onToggle: () => void;

  // optional flag used to disable the button
  disabled?: boolean;
}

// reausable button to save or remove a location
export const SaveLocationButton: React.FC<SaveLocationButtonProps> = ({ 
  
  saved, 
  onToggle,
  disabled 
  
}) => {

  return (

    <button 
      type='button'
      className={`${styles['save-btn']} ${
        saved 
          ? styles['saved'] 
          : ''
        }`
      }
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={saved}
      aria-label={
        saved 
          ? 'Remove from saved cities' 
          : 'Save city'
      }
    >
        {/* fill the bookmark whenthe location is saved */}
        <Bookmark 
          size={18} 
          fill={saved 
            ? 'currentColor' 
            : 'none'
          } strokeWidth={1.75}
        />

        <Text variant='p'>
          {saved ? 'Remove Location' : 'Save Location'}
        </Text>

    </button>
  )
}
