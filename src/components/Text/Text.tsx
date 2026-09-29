import React, { type JSX } from 'react'

// defines all html text elements
// that the text component is allowed to render.
type Variant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'p' 
  | 'span';

// props requured by the text component
interface TextProps {

  // determines which html element should be rendered.
  // defaults to a paragrapgh when not provided.
  variant?: Variant,

  // content displayed inside the text element.
  children: React.ReactNode,

  // optional inline styles.
  style?: React.CSSProperties,

  // optional css class passed from the parent component
  className?: string,
}

// maps each variant to its matching html element.
const variantMapping: Record<
  Variant, 
  keyof JSX.IntrinsicElements
> = {

  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  span: 'span'
};

// reusable text component that renders
// the correct html element based on the variant.
export const Text = ({ 

  variant = 'p', 
  children, 
  ...props 

}: TextProps) => {

  // select the html element that matches the variant.
  const Tag = 
    variantMapping[variant];

  return (

    // spread any additional props such as 
    // className or style onto the rendered element.
    <Tag {...props}>

      {children}

    </Tag>

  );

}
