import { Bookmark } from 'lucide-react';
import React from 'react'

import styles from './SaveLocationButton.module.css'
import { Text } from '../Text/Text';

interface SaveLocationButtonProps {
    saved: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

export const SaveLocationButton: React.FC<SaveLocationButtonProps> = ({ saved, onToggle, disabled }) => {
  return (
    <button type='button'
        className={`${styles['save-btn']} ${saved ? styles['saved'] : ''}`}
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved cities' : 'Save city'}
    >
        <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.75}/>
        <Text variant='p'>Save</Text>
    </button>
  )
}
