import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import inventoryService from '@/services/api/inventoryService'
import requestService from '@/services/api/requestService'
import categoryService from '@/services/api/categoryService'
import DashboardHeader from '@/components/organisms/DashboardHeader'
import DashboardSummaryMetrics from '@/components/organisms/DashboardSummaryMetrics'
import DashboardRecentActivityList from '@/components/organisms/DashboardRecentActivityList'
import DashboardPendingRequestsList from '@/components/organisms/DashboardPendingRequestsList'
import DashboardCategoryOverview from '@/components/organisms/DashboardCategoryOverview'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const DashboardPage = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [requestData, setRequestData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [inventory, requests, categories] = await Promise.all([
        inventoryService.getAll(),
        requestService.getAll(),
        categoryService.getAll()
      ])
      setInventoryData(inventory)
      setRequestData(requests)
      setCategoryData(categories)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleQuickApprove = async (requestId) => {
    try {
      const updatedRequest = await requestService.update(requestId, { status: 'approved' })
      setRequestData(prev =>
        prev.map(req => req.id === requestId ? updatedRequest : req)
      )
      toast.success('Request approved successfully')
    } catch (err) {
      toast.error('Failed to approve request')
    }
  }

  // Calculate dashboard metrics
  const totalItems = inventoryData.length
  const lowStockItems = inventoryData.filter(item => item.quantity <= item.minStock)
  const outOfStockItems = inventoryData.filter(item => item.quantity === 0)
  const pendingRequests = requestData.filter(req => req.status === 'pending')
  const recentActivity = [...inventoryData, ...requestData]
    .sort((a, b) => new Date(b.lastUpdated || b.requestDate) - new Date(a.lastUpdated || a.requestDate))
    .slice(0, 5)

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-surface-200 rounded w-20 mb-4"></div>
              <div className="h-8 bg-surface-200 rounded w-16"></div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-surface-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <Text as="h3" className="text-xl font-semibold text-surface-900 mb-2">Dashboard Error</Text>
          <Text as="p" className="text-surface-600 mb-6 max-w-md">{error}</Text>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <DashboardHeader
        title="Dashboard"
        subtitle="Monitor your school's inventory status and manage requests efficiently"
        animationProps={{ initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } }}
      />

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-warning to-accent-500 text-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" className="w-6 h-6" />
            <div>
              <Text as="h3" className="font-semibold">Inventory Alerts</Text>
              <Text as="p" className="text-sm opacity-90">
                {outOfStockItems.length > 0 && `${outOfStockItems.length} items out of stock`}
                {outOfStockItems.length > 0 && lowStockItems.length > 0 && ' • '}
                {lowStockItems.length > 0 && `${lowStockItems.length} items running low`}
              </Text>
            </div>
          </div>
        </motion.div>
      )}

      <DashboardSummaryMetrics
        totalItems={totalItems}
        lowStockCount={lowStockItems.length}
        pendingRequestsCount={pendingRequests.length}
        categoryCount={categoryData.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRecentActivityList activityData={recentActivity} inventoryData={inventoryData} />
        <DashboardPendingRequestsList
          pendingRequests={pendingRequests}
          inventoryData={inventoryData}
          onApproveRequest={handleQuickApprove}
          onViewAllRequests={() => console.log('Navigate to requests page')} // Placeholder
        />
      </div>

      <DashboardCategoryOverview categoryData={categoryData} inventoryData={inventoryData} />
    </div>
  )
}

export default DashboardPage