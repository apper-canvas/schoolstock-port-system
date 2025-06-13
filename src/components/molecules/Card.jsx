import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  initial,
  animate,
  transition,
  onClick,
  ...props
}) => {
  const Component = initial || animate || transition ? motion.div : 'div'

  const baseClasses = 'bg-white rounded-lg shadow-sm border border-surface-200'
  const finalClassName = `${baseClasses} ${className}`

  return (
    <Component
      className={finalClassName}
      initial={initial}
      animate={animate}
      transition={transition}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card