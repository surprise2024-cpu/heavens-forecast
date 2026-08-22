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
import { NavLink } from 'react-router';

export interface NavItem {
    icon: LucideIcon;
    label: string;
    path: string;
}

const defaultNavItems: NavItem[] = [
    {icon: CloudSun, label: 'Weather', path: '/'},
    {icon: List, label: 'Cities', path: '/cities'},
    {icon: MapIcon, label: 'Map', path: '/map'},
    {icon: Settings, label: 'Settings', path: '/settings'},
];

interface NavbarProps {
    navItems?: NavItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ navItems = defaultNavItems }) => {
  return (
    <>
        {/*Sidebar*/}
        <aside className={styles['nav']}>

            <div className={styles['nav-logo']}>

                <Wind size={20} strokeWidth={1.75}/>

            </div>

            {
                navItems.map(({ icon: Icon, label, path}) => {
                
                    return (

                    <NavLink 
                        key={label} 
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) => `${styles['nav-item']} ${isActive ? styles['active'] : ''}`}
                        
                    >

                        <Icon size={20} strokeWidth={1.75} />

                        <Text variant='span'>{label}</Text>

                    </NavLink>
                );
                })
            }
        </aside>
    </>
  );
}
