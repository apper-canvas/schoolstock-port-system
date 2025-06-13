import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Title from '@/components/atoms/Title'
import Card from '@/components/molecules/Card'
import StatusBadge from '@/components/molecules/StatusBadge'

const RequestCard = ({
  request,
  item,
  onApprove,
  onReject,
  onMarkFulfilled,
  onViewDetails,
  index, // for animation delay
}) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-6 hover:border-surface-300 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
<div className="flex items-center space-x-3 mb-3">
            <Title as="h3" className="text-lg text-surface-900 break-words">
              {item?.name || 'Unknown Item'}
            </Title>
            <StatusBadge status={request.status} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <Text as="p" className="text-surface-500">Quantity</Text>
              <Text as="p" className="font-medium text-surface-900">
                {request.quantity} {item?.unit || 'units'}
              </Text>
            </div>
            
            <div>
              <Text as="p" className="text-surface-500">Requester</Text>
              <Text as="p" className="font-medium text-surface-900 break-words">{request.requester}</Text>
            </div>
            
            <div>
              <Text as="p" className="text-surface-500">Department</Text>
              <Text as="p" className="font-medium text-surface-900 break-words">{request.department}</Text>
            </div>
            
            <div>
              <Text as="p" className="text-surface-500">Request Date</Text>
              <Text as="p" className="font-medium text-surface-900">
                {new Date(request.requestDate).toLocaleDateString()}
              </Text>
            </div>
          </div>
          
          {request.notes && (
            <div className="mt-3">
              <Text as="p" className="text-surface-500 text-sm">Notes</Text>
              <Text as="p" className="text-surface-700 text-sm break-words">{request.notes}</Text>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-6">
          {request.status === 'pending' && (
            <>
              <Button
                onClick={() => onApprove(request.id)}
                className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name="CheckCircle" size={14} />
                <span>Approve</span>
              </Button>
              
              <Button
                onClick={() => onReject(request.id)}
                className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name="XCircle" size={14} />
                <span>Reject</span>
              </Button>
            </>
          )}
          
          {request.status === 'approved' && (
            <Button
              onClick={() => onMarkFulfilled(request.id)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center space-x-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name="Package" size={14} />
              <span>Mark Fulfilled</span>
            </Button>
          )}
          
          <Button
            onClick={() => onViewDetails(request)}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="MoreVertical" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default RequestCard