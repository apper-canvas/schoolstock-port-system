import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const DashboardPendingRequestsList = ({ pendingRequests, inventoryData, onApproveRequest, onViewAllRequests }) => {
  return (
    <Card
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <Title as="h3" className="text-lg text-surface-900">Pending Requests</Title>
          <Text as="span" className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
            {pendingRequests.length}
          </Text>
        </div>
      </div>
      
      <div className="p-6">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
            <Text as="p" className="text-surface-500">All requests processed!</Text>
            <Text as="p" className="text-xs text-surface-400 mt-1">No pending approvals</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.slice(0, 4).map((request, index) => {
              const item = inventoryData.find(inv => inv.id === request.itemId)
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:border-surface-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Title as="h4" className="text-sm font-medium text-surface-900 break-words">
                      {item?.name || 'Unknown Item'}
                    </Title>
                    <Text as="p" className="text-sm text-surface-600 break-words">
                      {request.quantity} {item?.unit || 'units'} • {request.requester}
                    </Text>
                    <Text as="p" className="text-xs text-surface-500 break-words">
                      {request.department} • {new Date(request.requestDate).toLocaleDateString()}
                    </Text>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onApproveRequest(request.id)}
                      className="bg-success text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </Button>
                    <Button className="bg-surface-100 text-surface-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-surface-200 transition-colors">
                      Review
                    </Button>
                  </div>
                </motion.div>
              )
            })}
            
            {pendingRequests.length > 4 && (
              <div className="text-center pt-2">
                <Button onClick={onViewAllRequests} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View all {pendingRequests.length} requests →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default DashboardPendingRequestsList