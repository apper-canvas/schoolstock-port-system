import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import inventoryService from '../services/api/inventoryService'
import requestService from '../services/api/requestService'
import categoryService from '../services/api/categoryService'

const Dashboard = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [requestData, setRequestData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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
  }

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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>

        {/* Stats Skeleton */}
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

        {/* Content Skeleton */}
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
          <h3 className="text-xl font-semibold text-surface-900 mb-2">Dashboard Error</h3>
          <p className="text-surface-600 mb-6 max-w-md">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Retry Loading
          </motion.button>
        </div>
      </div>
    )
  }

  // Calculate dashboard metrics
  const totalItems = inventoryData.length
  const lowStockItems = inventoryData.filter(item => item.quantity <= item.minStock)
  const outOfStockItems = inventoryData.filter(item => item.quantity === 0)
  const pendingRequests = requestData.filter(req => req.status === 'pending')
  const recentActivity = [...inventoryData, ...requestData]
    .sort((a, b) => new Date(b.lastUpdated || b.requestDate) - new Date(a.lastUpdated || a.requestDate))
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
          Dashboard
        </h1>
        <p className="text-surface-600">
          Monitor your school's inventory status and manage requests efficiently
        </p>
      </motion.div>

      {/* Critical Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-warning to-accent-500 text-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Inventory Alerts</h3>
              <p className="text-sm opacity-90">
                {outOfStockItems.length > 0 && `${outOfStockItems.length} items out of stock`}
                {outOfStockItems.length > 0 && lowStockItems.length > 0 && ' • '}
                {lowStockItems.length > 0 && `${lowStockItems.length} items running low`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Items</p>
              <p className="text-3xl font-bold text-surface-900">{totalItems}</p>
              <p className="text-xs text-surface-500 mt-1">Across all categories</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-7 h-7 text-primary-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Low Stock</p>
              <p className="text-3xl font-bold text-warning">{lowStockItems.length}</p>
              <p className="text-xs text-surface-500 mt-1">Need replenishment</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingDown" className="w-7 h-7 text-warning" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Pending Requests</p>
              <p className="text-3xl font-bold text-secondary-500">{pendingRequests.length}</p>
              <p className="text-xs text-surface-500 mt-1">Awaiting approval</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-7 h-7 text-secondary-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Categories</p>
              <p className="text-3xl font-bold text-surface-900">{categoryData.length}</p>
              <p className="text-xs text-surface-500 mt-1">Item types</p>
            </div>
            <div className="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Grid3X3" className="w-7 h-7 text-surface-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Recent Activity</h3>
              <ApperIcon name="Activity" className="w-5 h-5 text-surface-400" />
            </div>
          </div>
          
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
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
                      <p className="text-sm font-medium text-surface-900 break-words">
                        {item.requester ? 
                          `Request for ${inventoryData.find(inv => inv.id === item.itemId)?.name || 'Unknown Item'}` :
                          `Updated ${item.name}`
                        }
                      </p>
                      <p className="text-xs text-surface-500 break-words">
                        {item.requester ? 
                          `By ${item.requester} • ${item.department}` :
                          `${item.quantity} ${item.unit} • ${item.location}`
                        }
                      </p>
                    </div>
                    
                    <span className="text-xs text-surface-400 whitespace-nowrap">
                      {new Date(item.lastUpdated || item.requestDate).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions & Pending Requests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Pending Requests</h3>
              <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
                {pendingRequests.length}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="text-surface-500">All requests processed!</p>
                <p className="text-xs text-surface-400 mt-1">No pending approvals</p>
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
                        <h4 className="text-sm font-medium text-surface-900 break-words">
                          {item?.name || 'Unknown Item'}
                        </h4>
                        <p className="text-sm text-surface-600 break-words">
                          {request.quantity} {item?.unit || 'units'} • {request.requester}
                        </p>
                        <p className="text-xs text-surface-500 break-words">
                          {request.department} • {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleQuickApprove(request.id)}
                          className="bg-success text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </motion.button>
                        <button className="bg-surface-100 text-surface-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-surface-200 transition-colors">
                          Review
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
                
                {pendingRequests.length > 4 && (
                  <div className="text-center pt-2">
                    <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                      View all {pendingRequests.length} requests →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200"
      >
        <div className="p-6 border-b border-surface-200">
          <h3 className="text-lg font-semibold text-surface-900">Inventory by Category</h3>
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
                    <h4 className="font-medium text-surface-900 break-words">{category.name}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600">Total Items</span>
                      <span className="font-medium text-surface-900">{categoryItems.length}</span>
                    </div>
                    {lowStockInCategory > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-warning">Low Stock</span>
                        <span className="font-medium text-warning">{lowStockInCategory}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard