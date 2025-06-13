import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import RequestCard from '@/components/molecules/RequestCard'
import Card from '@/components/molecules/Card'

const RequestsList = ({
  filteredRequests,
  inventoryData,
  searchTerm,
  selectedStatus,
  onApproveRequest,
  onRejectRequest,
  onMarkFulfilled,
  onViewRequestDetails,
  onCreateFirstRequest,
  animationProps = {}
}) => {
  return (
    <motion.div className="space-y-4" {...animationProps}>
      {filteredRequests.length === 0 ? (
        <Card className="p-12 text-center">
          <ApperIcon name="FileText" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <Title as="h3" className="text-lg font-medium text-surface-900 mb-2">No requests found</Title>
          <Text as="p" className="text-surface-500 mb-6">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first request'
            }
          </Text>
          {!searchTerm && selectedStatus === 'all' && (
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateFirstRequest}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Create First Request
            </Button>
          )}
        </Card>
      ) : (
        filteredRequests.map((request, index) => {
          const item = inventoryData.find(inv => inv.id === request.itemId)
          
          return (
            <RequestCard
              key={request.id}
              request={request}
              item={item}
              onApprove={onApproveRequest}
              onReject={onRejectRequest}
              onMarkFulfilled={onMarkFulfilled}
              onViewDetails={onViewRequestDetails}
              index={index}
            />
          )
        })
      )}
    </motion.div>
  )
}

export default RequestsList