import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import inventoryService from '../services/api/inventoryService'
import requestService from '../services/api/requestService'

const MainFeature = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [requestData, setRequestData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [inventory, requests] = await Promise.all([
        inventoryService.getAll(),
        requestService.getAll()
      ])
      setInventoryData(inventory)
      setRequestData(requests)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStock = async (itemId, newQuantity) => {
    try {
      const updatedItem = await inventoryService.update(itemId, { quantity: newQuantity })
      setInventoryData(prev => 
        prev.map(item => item.id === itemId ? updatedItem : item)
      )
      toast.success('Stock updated successfully')
    } catch (err) {
      toast.error('Failed to update stock')
    }
  }

  const handleApproveRequest = async (requestId) => {
    try {
      const updatedRequest = await requestService.update(requestId, { status: 'approved' })
      setRequestData(prev =>
        prev.map(req => req.id === requestId ? updatedRequest : req)
      )
      toast.success('Request approved')
    } catch (err) {
      toast.error('Failed to approve request')
    }
  }

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { status: 'out', color: 'bg-error text-white', text: 'Out of Stock' }
    if (quantity <= minStock) return { status: 'low', color: 'bg-warning text-white', text: 'Low Stock' }
    return { status: 'good', color: 'bg-success text-white', text: 'In Stock' }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Data</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const lowStockItems = inventoryData.filter(item => item.quantity <= item.minStock)
  const pendingRequests = requestData.filter(req => req.status === 'pending')

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Alert Banner */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning text-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" className="w-5 h-5" />
            <span className="font-medium">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock
            </span>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-600">Total Items</p>
              <p className="text-2xl font-bold text-surface-900">{inventoryData.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-primary-500" />
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
              <p className="text-sm text-surface-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning" />
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
              <p className="text-sm text-surface-600">Pending Requests</p>
              <p className="text-2xl font-bold text-secondary-500">{pendingRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-secondary-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Inventory Items */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200">
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Recent Inventory</h3>
            <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
              View All
            </button>
          </div>
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
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {inventoryData.slice(0, 5).map((item, index) => {
                const stockStatus = getStockStatus(item.quantity, item.minStock)
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900 break-words min-w-0">
                        {item.name}
                      </div>
                      <div className="text-sm text-surface-500 break-words">
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-surface-100 text-surface-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleUpdateStock(item.id, item.quantity + 1)}
                        className="text-success hover:text-green-700"
                      >
                        +1
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200">
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-surface-900">Pending Requests</h3>
          </div>
          
          <div className="p-6 space-y-4">
            {pendingRequests.slice(0, 3).map((request, index) => {
              const item = inventoryData.find(i => i.id === request.itemId)
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-surface-200 rounded-lg hover:border-surface-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-surface-900 break-words">
                      {item?.name || 'Unknown Item'}
                    </h4>
                    <p className="text-sm text-surface-600 break-words">
                      Requested by {request.requester} • {request.quantity} {item?.unit || 'units'}
                    </p>
                    <p className="text-xs text-surface-500 break-words">
                      {request.department} • {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-success text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </motion.button>
                    <button className="bg-surface-100 text-surface-700 px-3 py-1 rounded text-sm hover:bg-surface-200 transition-colors">
                      Reject
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MainFeature