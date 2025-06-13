import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'

const StatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (s) => {
    switch (s) {
      case 'pending': return 'bg-warning text-white'
      case 'approved': return 'bg-success text-white'
      case 'rejected': return 'bg-error text-white'
      case 'fulfilled': return 'bg-primary-500 text-white'
      case 'out': return 'bg-error text-white'
      case 'low': return 'bg-warning text-white'
      case 'good': return 'bg-success text-white'
      default: return 'bg-surface-100 text-surface-700'
    }
  }

  const getStatusIcon = (s) => {
    switch (s) {
      case 'pending': return 'Clock'
      case 'approved': return 'CheckCircle'
      case 'rejected': return 'XCircle'
      case 'fulfilled': return 'Package'
      case 'out': return 'AlertCircle'
      case 'low': return 'AlertTriangle'
      case 'good': return 'CheckCircle'
      default: return 'FileText'
    }
  }

  const textMap = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    fulfilled: 'Fulfilled',
    out: 'Out of Stock',
    low: 'Low Stock',
    good: 'In Stock',
  }

  return (
    <Text as="span" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)} ${className}`}>
      {status === 'pending' || status === 'approved' || status === 'rejected' || status === 'fulfilled' ? (
        <span className="flex items-center space-x-1">
          <ApperIcon name={getStatusIcon(status)} size={14} />
          <span className="capitalize">{textMap[status] || status}</span>
        </span>
      ) : (
        textMap[status] || status
      )}
    </Text>
  )
}

export default StatusBadge