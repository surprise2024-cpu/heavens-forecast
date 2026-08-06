import React from 'react'

import styles from './Text.module.css'

type TextProps = {
    variant: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string
}

export const Text: React.FC<TextProps> = ({ children, style, variant, className }) => {
    if(variant='h1') return <h1 className={className} style={style} >{children}</h1>
    if(variant='h2') return <h2 className={className} style={style} >{children}</h2>
    if(variant='p') return <p className={className} style={style} >{children}</p>
    if(variant='span') return <span className={className} style={style} >{children}</span>
  return (
    <div>{children}</div>
  )
}
