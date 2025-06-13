import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import requestService from '@/services/api/requestService'
import inventoryService from '@/services/api/inventoryService'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'
import Input from '@/components/atoms/Input'
import RequestsList from '@/components/organisms/RequestsList'
import RequestModalForm from '@/components/organisms/RequestModalForm'

const RequestsPage = () => {
  const [requestData, setRequestData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('requestDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null) // For potential view/edit
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    requester: '',
    department: '',
    notes: ''
  })

  const loadData = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddRequest = async (e) => {
    e.preventDefault()
    try {
      const newRequest = await requestService.create({
        ...formData,
        quantity: parseInt(formData.quantity),
        status: 'pending',
        requestDate: new Date().toISOString(), // Add request date
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
          <Title as="h3" className="text-xl font-semibold text-surface-900 mb-2">Failed to Load Requests</Title>
          <Text as="p" className="text-surface-600 mb-6 max-w-md">{error}</Text>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Try Again
          </Button>
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
            <Title as="h1" className="text-3xl text-surface-900">Requests</Title>
            <Text as="p" className="text-surface-600 mt-1">
              Manage inventory requests and approvals
            </Text>
          </div>
          
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>New Request</span>
          </Button>
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
          <Button
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
                <Text as="p" className="text-sm font-medium">{status.label}</Text>
                <Text as="p" className={`text-lg font-bold ${
                  selectedStatus === status.key ? '' : 'text-surface-900'
                }`}>
                  {statusCounts[status.key]}
                </Text>
              </div>
            </div>
          </Button>
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
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search requests..."
              icon="Search"
            />
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
            
            <Button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            </Button>
          </div>
        </div>
      </motion.div>

      <RequestsList
        filteredRequests={filteredData}
        inventoryData={inventoryData}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onApproveRequest={(id) => handleUpdateStatus(id, 'approved')}
        onRejectRequest={(id) => handleUpdateStatus(id, 'rejected')}
        onMarkFulfilled={(id) => handleUpdateStatus(id, 'fulfilled')}
        onViewRequestDetails={setSelectedRequest} // Assuming a detail modal would pop up
        onCreateFirstRequest={() => setIsAddModalOpen(true)}
        animationProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 } }}
      />

      <RequestModalForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRequest}
        formData={formData}
        setFormData={setFormData}
        inventoryOptions={inventoryData}
      />
    </div>
  )
}

export default RequestsPage