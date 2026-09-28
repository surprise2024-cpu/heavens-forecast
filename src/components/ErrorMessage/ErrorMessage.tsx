import React from 'react'

import styles from './ErrorMessage.module.css'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Text } from '../Text/Text'

// props required by the errormessage component.
interface ErrorMessageProps {

    // error message shown to the user.
    message: string,

    // function that runs when the user tries again.
    onRetry?: () => void
}

// displays an error state together with a retry option.
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message, 
    onRetry

}) => {

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

        {/* displays the specific error message received. */}
        <Text 
            variant='p' 
            className={styles['mess']}
        >
            {message}
        </Text>

        {/* gives the user an alternative action. */}
        <Text 
            variant='p' 
            className={styles['hint']}
        >
            You can also search for a city using the search bar above.
        </Text>

        {/* show the retry button when a retry function is avalable. */}
        {
            onRetry && ( 

                <div className={styles['btn-cont']}>

                    <button 
                    className={styles['refresh-btn']}
                    onClick={onRetry}
                    >

                    <RefreshCw size={16} />
                    <Text variant='span' className={styles['btn-mess']}>Refresh</Text>

                </button>
                </div>
            )
        }
    </div>
  );
}
