import React from 'react'

import styles from './ErrorMessage.module.css'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Text } from '../Text/Text'

interface ErrorMessageProps {
    message: string,
    onRetry: () => void
}


export const ErrorMessage: React.FC<ErrorMessageProps> = ({message, onRetry}) => {
  return (

    <div className={styles['error-container']}>

        <div className={styles['error']}>

             <div className={styles['alert-circle']}>

                <AlertCircle size={16}/>

            </div>

            <Text variant='h3' className={styles['error-mess']}>
                Something went wrong
            </Text>
        </div>

        <Text variant='p' className={styles['mess']}>{message}</Text>

        <Text variant='p' className={styles['hint']}>
            You can also search for a city using the search bar above.
        </Text>

        {/*Conditional rendering */}
        {
            onRetry && ( 

                <div className={styles['btn-cont']}>

                    <button 
                    className={styles['refresh-btn']}
                    onClick={onRetry}
                    >

                    <RefreshCw size={16} />
                    <Text variant='span' className={styles['btn-mess']}>Try Agian</Text>

                </button>
                </div>
            )
        }
    </div>
  );
}
