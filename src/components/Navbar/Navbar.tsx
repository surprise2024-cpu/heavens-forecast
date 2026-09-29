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

import { 
    NavLink 
} from 'react-router';

// describes the structure of each navigation item.
export interface NavItem {
    icon: LucideIcon;
    label: string;
    path: string;
}

// default navigation options used by the sidebar.
const defaultNavItems: NavItem[] = [
    {icon: CloudSun, label: 'Weather', path: '/'},
    {icon: List, label: 'Cities', path: '/cities'},
    {icon: MapIcon, label: 'Map', path: '/map'},
    {icon: Settings, label: 'Settings', path: '/settings'},
];

// props accepted by the navbar component.
interface NavbarProps {

    // optonal and custom navigation list
    navItems?: NavItem[];
}

// displays the application's sidebar navigation.
export const Navbar: React.FC<NavbarProps> = ({ 

    navItems = defaultNavItems 

}) => {

  return (
    <>
    {/*Sidebar*/}
    <aside className={styles['nav']}>

        {/*App logo*/}
        <div className={styles['nav-logo']}>

            <Wind size={20} strokeWidth={1.75}/>

        </div>

        {/* create a navigation link for each item */}
        {
            navItems.map(
                ({ 

                    icon: Icon, 
                    label, 
                    path

                }) => {
            
                return (

                    <NavLink 
                        key={label} 
                        to={path}

                        // prevent the root '/' from
                        // staying active on every other page.
                        end={path === '/'}

                        // apply the active css class when
                        // the current URL matches this route
                        className={({ isActive }) => 
                            `${styles['nav-item']} ${
                                isActive 
                                ? styles['active'] 
                                : ''
                            }`
                        }
                        
                    >
                        {/* navigation icon */}
                        <Icon size={20} strokeWidth={1.75} />

                        {/* navigation label */}
                        <Text variant='span'>{label}</Text>

                    </NavLink>
                );

            })

        }

    </aside>

    </>

  );

}
