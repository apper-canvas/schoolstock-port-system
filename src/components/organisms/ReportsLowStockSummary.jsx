import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import StatusBadge from '@/components/molecules/StatusBadge'

const ReportsLowStockSummary = ({ lowStockItems }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="p-6 border-b border-surface-200">
        <Title as="h3" className="text-lg text-surface-900">Low Stock Items Summary</Title>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Min Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {lowStockItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
                  <Text as="p" className="text-surface-500">All items are well stocked!</Text>
                </td>
              </tr>
            ) : (
              lowStockItems
                .slice(0, 10)
                .map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text as="div" className="text-sm font-medium text-surface-900 break-words">
                        {item.name}
                      </Text>
                      <Text as="div" className="text-sm text-surface-500 break-words">
                        {item.location}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.category} className="bg-surface-100 text-surface-800" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.quantity === 0 ? 'out' : 'low'} />
                    </td>
                  </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ReportsLowStockSummary