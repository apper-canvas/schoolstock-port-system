import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const DashboardCategoryOverview = ({ categoryData, inventoryData }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="p-6 border-b border-surface-200">
        <Title as="h3" className="text-lg text-surface-900">Inventory by Category</Title>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryData.map((category, index) => {
            const categoryItems = inventoryData.filter(item => item.category === category.name)
            const lowStockInCategory = categoryItems.filter(item => item.quantity <= item.minStock).length
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-surface-200 rounded-lg hover:border-surface-300 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={category.icon} className="w-4 h-4 text-primary-500" />
                  </div>
                  <Title as="h4" className="font-medium text-surface-900 break-words">{category.name}</Title>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Text as="span" className="text-surface-600">Total Items</Text>
                    <Text as="span" className="font-medium text-surface-900">{categoryItems.length}</Text>
                  </div>
                  {lowStockInCategory > 0 && (
                    <div className="flex justify-between text-sm">
                      <Text as="span" className="text-warning">Low Stock</Text>
                      <Text as="span" className="font-medium text-warning">{lowStockInCategory}</Text>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default DashboardCategoryOverview