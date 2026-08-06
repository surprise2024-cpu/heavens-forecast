import React, { type JSX } from 'react'

import styles from './Text.module.css'

type Variant = 'h1' | 'h2' | 'p' | 'span';

interface TextProps {
  variant?: Variant,
  children: React.ReactNode,
  style?: React.CSSProperties,
  className?: string,
}

const variantMapping: Record<Variant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  p: 'p',
  span: 'span',
};

export const Text = ({ variant = 'p', children, ...props }: TextProps) => {

  const Tag = variantMapping[variant] || 'p';

  return (

    <Tag {...props}>
      {children}
    </Tag>

  )
}
