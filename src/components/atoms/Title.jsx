import React from 'react'

const Title = ({ as = 'h1', children, className = '', ...props }) => {
  const Tag = as
  return (
    <Tag className={`font-heading font-bold ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export default Title