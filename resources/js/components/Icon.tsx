//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
import React from 'react'

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const Icon = ({ 
  icon, 
  size = '1rem'
}: IconProps) => {

  // Convert rem to pixels (rem is not supported as an svg size unit in all
  // browsers, but being able to use rem's is quite helpful while developing)
  const pxSize = size.toLowerCase().includes('rem')
    ? convertRemToPixels(Number(size.replace('rem', '')))
    : size

  return (
    <svg
      width={`${pxSize}`}
      height={`${pxSize}`}
      viewBox="0 0 1024 1024">
      <path
        d={icon}
        style={{ fill: "currentColor" }} />
    </svg>
  )
}

//------------------------------------------------------------------------------
// Convert rem to px
//------------------------------------------------------------------------------
const convertRemToPixels = (rem: number) => {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

//------------------------------------------------------------------------------
// Props
//------------------------------------------------------------------------------
export type IconProps = {
  icon: string
  size?: string
}

export default Icon