import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  whileHover,
  whileTap,
  ...props
}) => {
  const Component = whileHover || whileTap ? motion.button : 'button'
  
  // Filter out non-DOM props if rendering as a native button
  const filteredProps = { ...props }
  if (Component === 'button') {
    delete filteredProps.initial
    delete filteredProps.animate
    delete filteredProps.exit
    delete filteredProps.transition
  }

  return (
    <Component
      type={type}
      onClick={onClick}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      {...filteredProps}
    >
      {children}
    </Component>
  )
}

export default Button