import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const DashboardRecentActivityList = ({ activityData, inventoryData }) => {
  return (
    <Card
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <Title as="h3" className="text-lg text-surface-900">Recent Activity</Title>
          <ApperIcon name="Activity" className="w-5 h-5 text-surface-400" />
        </div>
      </div>
      
      <div className="p-6">
        {activityData.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <Text as="p" className="text-surface-500">No recent activity</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {activityData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  item.requester ? 'bg-secondary-500' : 'bg-primary-500'
                }`}></div>
                
                <div className="flex-1 min-w-0">
                  <Text as="p" className="text-sm font-medium text-surface-900 break-words">
                    {item.requester ? 
                      `Request for ${inventoryData.find(inv => inv.id === item.itemId)?.name || 'Unknown Item'}` :
                      `Updated ${item.name}`
                    }
                  </Text>
                  <Text as="p" className="text-xs text-surface-500 break-words">
                    {item.requester ? 
                      `By ${item.requester} • ${item.department}` :
                      `${item.quantity} ${item.unit} • ${item.location}`
                    }
                  </Text>
                </div>
                
                <Text as="span" className="text-xs text-surface-400 whitespace-nowrap">
                  {new Date(item.lastUpdated || item.requestDate).toLocaleDateString()}
                </Text>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default DashboardRecentActivityList