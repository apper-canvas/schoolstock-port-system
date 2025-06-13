import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import inventoryService from '../services/api/inventoryService'
import categoryService from '../services/api/categoryService'

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    location: '',
    unit: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [inventory, categories] = await Promise.all([
        inventoryService.getAll(),
        categoryService.getAll()
      ])
      setInventoryData(inventory)
      setCategoryData(categories)
    } catch (err) {
      setError(err.message || 'Failed to load inventory data')
      toast.error('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const newItem = await inventoryService.create({
        ...formData,
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock)
      })
      setInventoryData(prev => [...prev, newItem])
      setFormData({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' })
      setIsAddModalOpen(false)
      toast.success('Item added successfully')
    } catch (err) {
      toast.error('Failed to add item')
    }
  }

  const handleEditItem = async (e) => {
    e.preventDefault()
    try {
      const updatedItem = await inventoryService.update(editingItem.id, {
        ...formData,
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock)
      })
      setInventoryData(prev =>
        prev.map(item => item.id === editingItem.id ? updatedItem : item)
      )
      setEditingItem(null)
      setFormData({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' })
      toast.success('Item updated successfully')
    } catch (err) {
      toast.error('Failed to update item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    
    try {
      await inventoryService.delete(itemId)
      setInventoryData(prev => prev.filter(item => item.id !== itemId))
      toast.success('Item deleted successfully')
    } catch (err) {
      toast.error('Failed to delete item')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) return

    try {
      await Promise.all(selectedItems.map(id => inventoryService.delete(id)))
      setInventoryData(prev => prev.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
      toast.success(`${selectedItems.length} items deleted successfully`)
    } catch (err) {
      toast.error('Failed to delete selected items')
    }
  }

  const handleQuickUpdate = async (itemId, field, value) => {
    try {
      const updatedItem = await inventoryService.update(itemId, { [field]: value })
      setInventoryData(prev =>
        prev.map(item => item.id === itemId ? updatedItem : item)
      )
      toast.success('Item updated')
    } catch (err) {
      toast.error('Failed to update item')
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      minStock: item.minStock.toString(),
      location: item.location,
      unit: item.unit
    })
  }

  const closeModals = () => {
    setIsAddModalOpen(false)
    setEditingItem(null)
    setFormData({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' })
  }

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { status: 'out', color: 'bg-error text-white', text: 'Out of Stock' }
    if (quantity <= minStock) return { status: 'low', color: 'bg-warning text-white', text: 'Low Stock' }
    return { status: 'good', color: 'bg-success text-white', text: 'In Stock' }
  }

  // Filter and sort data
  const filteredData = inventoryData
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map(item => item.id))
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-200 rounded"></div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm">
            <div className="h-16 bg-surface-200 rounded-t-lg mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-100 mb-2 mx-6 rounded"></div>
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
          <h3 className="text-xl font-semibold text-surface-900 mb-2">Failed to Load Inventory</h3>
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
            <h1 className="text-3xl font-heading font-bold text-surface-900">Inventory</h1>
            <p className="text-surface-600 mt-1">
              Manage your school's supplies and equipment
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Add Item</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Search</label>
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 w-full border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categoryData.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="quantity">Quantity</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
              <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
            </button>
            
            {selectedItems.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <ApperIcon name="Trash2" size={16} />
                <span>Delete ({selectedItems.length})</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Item</span>
                    {sortBy === 'name' && (
                      <ApperIcon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {sortBy === 'category' && (
                      <ApperIcon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    {sortBy === 'quantity' && (
                      <ApperIcon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <ApperIcon name="Package" className="w-12 h-12 text-surface-300 mb-4" />
                      <h3 className="text-lg font-medium text-surface-900 mb-2">No items found</h3>
                      <p className="text-surface-500 mb-4">
                        {searchTerm || selectedCategory !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'Get started by adding your first inventory item'
                        }
                      </p>
                      {!searchTerm && selectedCategory === 'all' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsAddModalOpen(true)}
                          className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                        >
                          Add First Item
                        </motion.button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const stockStatus = getStockStatus(item.quantity, item.minStock)
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-surface-900 break-words">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-surface-100 text-surface-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-surface-900">
                            {item.quantity} {item.unit}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleQuickUpdate(item.id, 'quantity', Math.max(0, item.quantity - 1))}
                              className="w-6 h-6 bg-surface-100 rounded text-xs hover:bg-surface-200 transition-colors flex items-center justify-center"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuickUpdate(item.id, 'quantity', item.quantity + 1)}
                              className="w-6 h-6 bg-primary-100 text-primary-600 rounded text-xs hover:bg-primary-200 transition-colors flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-600 break-words">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-error hover:text-red-700 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Item Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingItem) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModals}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-w-full overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-surface-900">
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </h3>
                  <button
                    onClick={closeModals}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryData.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Min Stock *
                      </label>
                      <input
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Unit *
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., pieces, boxes, kg"
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Storage Room A, Science Lab"
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </motion.button>
                    <button
                      type="button"
                      onClick={closeModals}
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

export default Inventory