import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  icon,
  min,
  rows, // for textarea
  required,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
  const finalClassName = `${baseClasses} ${className} ${icon ? 'pl-10' : ''}`

  const inputProps = {
    value,
    onChange,
    placeholder,
    className: finalClassName,
    required,
    ...props
  }

  if (type === 'textarea') {
    return (
      <textarea
        rows={rows || 3}
        {...inputProps}
      />
    )
  }

  return (
    <div className="relative">
      {icon && (
        <ApperIcon
          name={icon}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400"
        />
      )}
      <input
        type={type}
        min={min}
        {...inputProps}
      />
    </div>
  )
}

export default Input