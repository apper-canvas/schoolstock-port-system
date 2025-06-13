import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import inventoryService from '@/services/api/inventoryService'
import categoryService from '@/services/api/categoryService'
import ApperIcon from '@/components/ApperIcon'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import InventoryTable from '@/components/organisms/InventoryTable'
import ItemFormModal from '@/components/organisms/ItemFormModal'

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const loadData = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

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
      setIsModalOpen(false)
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
      setIsModalOpen(false) // Close modal after edit
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

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' })
    setIsModalOpen(true)
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
    setIsModalOpen(true)
  }

  const closeModals = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' })
  }

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
    if (selectedItems.length === filteredData.length && filteredData.length > 0) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map(item => item.id))
    }
  }

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
          <Title as="h3" className="text-xl font-semibold text-surface-900 mb-2">Failed to Load Inventory</Title>
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title as="h1" className="text-3xl text-surface-900">Inventory</Title>
            <Text as="p" className="text-surface-600 mt-1">
              Manage your school's supplies and equipment
            </Text>
          </div>
          
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Add Item</span>
          </Button>
        </div>
      </motion.div>

      <InventoryTable
        inventoryData={inventoryData}
        categoryData={categoryData}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onCategoryChange={(e) => setSelectedCategory(e.target.value)}
        onSort={handleSort}
        onSortOrderToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        selectedItems={selectedItems}
        toggleSelectItem={toggleSelectItem}
        toggleSelectAll={toggleSelectAll}
        onQuickUpdate={handleQuickUpdate}
        onEditItem={openEditModal}
        onDeleteItem={handleDeleteItem}
        onBulkDelete={handleBulkDelete}
        onAddItem={openAddModal} // For empty state
      />

      <ItemFormModal
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingItem}
        categoryOptions={categoryData}
      />
    </div>
  )
}

export default InventoryPage