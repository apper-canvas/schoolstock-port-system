import React from 'react'

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`rounded border-surface-300 text-primary-600 focus:ring-primary-500 ${className}`}
      {...props}
    />
  )
}

export default Checkbox