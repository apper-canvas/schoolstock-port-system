import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import requestService from '../services/api/requestService'
import inventoryService from '../services/api/inventoryService'

const Requests = () => {
  const [requestData, setRequestData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('requestDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    requester: '',
    department: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [requests, inventory] = await Promise.all([
        requestService.getAll(),
        inventoryService.getAll()
      ])
      setRequestData(requests)
      setInventoryData(inventory)
    } catch (err) {
      setError(err.message || 'Failed to load requests data')
      toast.error('Failed to load requests data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRequest = async (e) => {
    e.preventDefault()
    try {
      const newRequest = await requestService.create({
        ...formData,
        quantity: parseInt(formData.quantity),
        status: 'pending'
      })
      setRequestData(prev => [...prev, newRequest])
      setFormData({ itemId: '', quantity: '', requester: '', department: '', notes: '' })
      setIsAddModalOpen(false)
      toast.success('Request submitted successfully')
    } catch (err) {
      toast.error('Failed to submit request')
    }
  }

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const updatedRequest = await requestService.update(requestId, { status: newStatus })
      setRequestData(prev =>
        prev.map(req => req.id === requestId ? updatedRequest : req)
      )
      toast.success(`Request ${newStatus} successfully`)
    } catch (err) {
      toast.error(`Failed to ${newStatus} request`)
    }
  }

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return
    
    try {
      await requestService.delete(requestId)
      setRequestData(prev => prev.filter(req => req.id !== requestId))
      toast.success('Request deleted successfully')
    } catch (err) {
      toast.error('Failed to delete request')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-white'
      case 'approved': return 'bg-success text-white'
      case 'rejected': return 'bg-error text-white'
      case 'fulfilled': return 'bg-primary-500 text-white'
      default: return 'bg-surface-100 text-surface-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock'
      case 'approved': return 'CheckCircle'
      case 'rejected': return 'XCircle'
      case 'fulfilled': return 'Package'
      default: return 'FileText'
    }
  }

  // Filter and sort data
  const filteredData = requestData
    .filter(request => {
      const item = inventoryData.find(inv => inv.id === request.itemId)
      const matchesSearch = 
        (item?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.department.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'requestDate') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

  const statusCounts = {
    all: requestData.length,
    pending: requestData.filter(r => r.status === 'pending').length,
    approved: requestData.filter(r => r.status === 'approved').length,
    rejected: requestData.filter(r => r.status === 'rejected').length,
    fulfilled: requestData.filter(r => r.status === 'fulfilled').length
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded"></div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">Failed to Load Requests</h3>
          <p className="text-surface-600 mb-6 max-w-md">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">Requests</h1>
            <p className="text-surface-600 mt-1">
              Manage inventory requests and approvals
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>New Request</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Status Filter Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {[
          { key: 'all', label: 'All Requests', color: 'bg-surface-100 text-surface-700', icon: 'FileText' },
          { key: 'pending', label: 'Pending', color: 'bg-warning text-white', icon: 'Clock' },
          { key: 'approved', label: 'Approved', color: 'bg-success text-white', icon: 'CheckCircle' },
          { key: 'rejected', label: 'Rejected', color: 'bg-error text-white', icon: 'XCircle' },
          { key: 'fulfilled', label: 'Fulfilled', color: 'bg-primary-500 text-white', icon: 'Package' }
        ].map((status, index) => (
          <motion.button
            key={status.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedStatus(status.key)}
            className={`p-4 rounded-lg transition-all ${
              selectedStatus === status.key 
                ? `${status.color} shadow-lg scale-105` 
                : 'bg-white border border-surface-200 hover:border-surface-300 text-surface-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon 
                name={status.icon} 
                size={20} 
                className={selectedStatus === status.key ? '' : 'text-surface-400'}
              />
              <div className="text-left">
                <p className="text-sm font-medium">{status.label}</p>
                <p className={`text-lg font-bold ${
                  selectedStatus === status.key ? '' : 'text-surface-900'
                }`}>
                  {statusCounts[status.key]}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Search and Sort */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="pl-10 pr-4 py-2 w-full border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="requestDate">Date</option>
              <option value="requester">Requester</option>
              <option value="status">Status</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-surface-200 text-center">
            <ApperIcon name="FileText" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No requests found</h3>
            <p className="text-surface-500 mb-6">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first request'
              }
            </p>
            {!searchTerm && selectedStatus === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Create First Request
              </motion.button>
            )}
          </div>
        ) : (
          filteredData.map((request, index) => {
            const item = inventoryData.find(inv => inv.id === request.itemId)
            const statusColor = getStatusColor(request.status)
            const statusIcon = getStatusIcon(request.status)
            
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:border-surface-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-surface-900 break-words">
                        {item?.name || 'Unknown Item'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusColor}`}>
                        <ApperIcon name={statusIcon} size={14} />
                        <span className="capitalize">{request.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-surface-500">Quantity</p>
                        <p className="font-medium text-surface-900">
                          {request.quantity} {item?.unit || 'units'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-surface-500">Requester</p>
                        <p className="font-medium text-surface-900 break-words">{request.requester}</p>
                      </div>
                      
                      <div>
                        <p className="text-surface-500">Department</p>
                        <p className="font-medium text-surface-900 break-words">{request.department}</p>
                      </div>
                      
                      <div>
                        <p className="text-surface-500">Request Date</p>
                        <p className="font-medium text-surface-900">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {request.notes && (
                      <div className="mt-3">
                        <p className="text-surface-500 text-sm">Notes</p>
                        <p className="text-surface-700 text-sm break-words">{request.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    {request.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUpdateStatus(request.id, 'approved')}
                          className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-1"
                        >
                          <ApperIcon name="CheckCircle" size={14} />
                          <span>Approve</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUpdateStatus(request.id, 'rejected')}
                          className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-1"
                        >
                          <ApperIcon name="XCircle" size={14} />
                          <span>Reject</span>
                        </motion.button>
                      </>
                    )}
                    
                    {request.status === 'approved' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUpdateStatus(request.id, 'fulfilled')}
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center space-x-1"
                      >
                        <ApperIcon name="Package" size={14} />
                        <span>Mark Fulfilled</span>
                      </motion.button>
                    )}
                    
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <ApperIcon name="MoreVertical" size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      {/* Add Request Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-w-full overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-surface-900">New Request</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Item *
                    </label>
                    <select
                      value={formData.itemId}
                      onChange={(e) => setFormData(prev => ({ ...prev, itemId: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Item</option>
                      {inventoryData.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {item.quantity} {item.unit} available
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Requester *
                    </label>
                    <input
                      type="text"
                      value={formData.requester}
                      onChange={(e) => setFormData(prev => ({ ...prev, requester: e.target.value }))}
                      placeholder="Your name"
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Mathematics, Science Lab"
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional information or justification"
                      rows="3"
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Submit Request
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 bg-surface-100 text-surface-700 py-2 rounded-lg font-semibold hover:bg-surface-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Requests