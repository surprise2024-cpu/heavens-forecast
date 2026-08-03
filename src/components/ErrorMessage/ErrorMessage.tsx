import React from 'react'

import styles from './ErrorMessage.module.css'
import { AlertCircle, RefreshCw } from 'lucide-react'

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
            <h3 className={styles['error-mess']}>
                Something went wrong
            </h3>
        </div>

        <p className={styles['mess']}>{message}</p>

        {/*Conditional rendering */}
        {
            onRetry && (
                <button 
                    className={styles['refresh-btn']}
                    onClick={onRetry}
                >

                <RefreshCw size={16} />
                <span className={styles['btn-mess']}>Try Agan</span>

            </button>
            )
        }
    </div>
    
  );
}
