import React from 'react'
import Text from '@/components/atoms/Text'

const FormField = ({ label, id, children, className = '', required = false }) => {
  return (
    <div className={className}>
      <Text as="label" htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
        {label} {required && <span className="text-error">*</span>}
      </Text>
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { id }) : child
      )}
    </div>
  )
}

export default FormField