import React from 'react'

import styles from './Navbar.module.css'
import { Text } from '../Text/Text';

import {
    Wind, 
    CloudSun, 
    List, 
    Map as MapIcon,
    Settings,
 
    type LucideIcon,
} from 'lucide-react'

export interface NavItem {
    icon: LucideIcon;
    label: string;
    active: boolean;
}

const defaultNavItems: NavItem[] = [
    {icon: CloudSun, label: 'Weather', active: true},
    {icon: List, label: 'Cities', active: false},
    {icon: MapIcon, label: 'Map', active: false},
    {icon: Settings, label: 'Settings', active: false},
];

interface NavbarProps {
    navItems?: NavItem[];
    activeLabel?: string;
    onSelect?: (label: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ navItems = defaultNavItems, activeLabel = 'Weather', onSelect }) => {
  return (
    <>
        {/*Sidebar*/}
        <aside className={styles['nav']}>

            <div className={styles['nav-logo']}>

                <Wind size={20} strokeWidth={1.75}/>

            </div>

            {
                navItems.map(({ icon: Icon, label}) => {
                    const active = label === activeLabel;
                
                    return (

                    <button key={label} 
                        className={`${styles['nav-item']} ${active ? styles['active'] : ''}`}
                        onClick={() => onSelect?.(label)}>

                        <Icon size={20} strokeWidth={1.75} />

                        <Text variant='span'>{label}</Text>

                    </button>
                );
                })
            }
        </aside>
    </>
  );
}
