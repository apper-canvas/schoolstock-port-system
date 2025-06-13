import React from 'react'

const Select = ({
  value,
  onChange,
  options = [],
  className = '',
  required,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
  const finalClassName = `${baseClasses} ${className}`

  return (
    <select
      value={value}
      onChange={onChange}
      className={finalClassName}
      required={required}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select