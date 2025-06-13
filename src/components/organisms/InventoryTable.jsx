import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import Checkbox from '@/components/atoms/Checkbox'
import Text from '@/components/atoms/Text'
import StatusBadge from '@/components/molecules/StatusBadge'
import FilterControls from '@/components/molecules/FilterControls'

const InventoryTable = ({
  inventoryData,
  categoryData,
  searchTerm,
  selectedCategory,
  sortBy,
  sortOrder,
  showAdvancedFilters,
  advancedFilters,
  onSearchChange,
  onCategoryChange,
  onSort,
  onSortOrderToggle,
  onAdvancedFiltersToggle,
  onAdvancedFiltersChange,
  selectedItems,
  toggleSelectItem,
  toggleSelectAll,
  onQuickUpdate,
  onEditItem,
  onDeleteItem,
  onBulkDelete,
  onAddItem,
}) => {

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { status: 'out', color: 'bg-error text-white', text: 'Out of Stock' }
    if (quantity <= minStock) return { status: 'low', color: 'bg-warning text-white', text: 'Low Stock' }
    return { status: 'good', color: 'bg-success text-white', text: 'In Stock' }
  }

const filteredData = inventoryData
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      
      // Advanced filters
      const matchesDateRange = !advancedFilters?.dateRange.startDate || !advancedFilters?.dateRange.endDate ||
        (new Date(item.lastUpdated) >= new Date(advancedFilters.dateRange.startDate) &&
         new Date(item.lastUpdated) <= new Date(advancedFilters.dateRange.endDate))
      
      const matchesLocation = !advancedFilters?.selectedLocations || 
                             advancedFilters.selectedLocations === 'all' || 
                             item.location === advancedFilters.selectedLocations
      
      const matchesMinStock = !advancedFilters?.minStockLevel || 
                             item.quantity >= parseInt(advancedFilters.minStockLevel)
      
      return matchesSearch && matchesCategory && matchesDateRange && matchesLocation && matchesMinStock
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

  const bulkDeleteButton = selectedItems.length > 0 && (
    <Button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onBulkDelete}
      className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
    >
      <ApperIcon name="Trash2" size={16} />
      <span>Delete ({selectedItems.length})</span>
    </Button>
  )

  return (
    <>
<FilterControls
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categoryData}
        sortBy={sortBy}
        onSortByChange={onSort}
        sortOrder={sortOrder}
        onSortOrderToggle={onSortOrderToggle}
        showAdvancedFilters={showAdvancedFilters}
        onAdvancedFiltersToggle={onAdvancedFiltersToggle}
        advancedFilters={advancedFilters}
        onAdvancedFiltersChange={onAdvancedFiltersChange}
        bulkDeleteButton={bulkDeleteButton}
        animationProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 } }}
      />

      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Checkbox
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => onSort('name')}
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
                  onClick={() => onSort('category')}
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
                  onClick={() => onSort('quantity')}
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
                      <Title as="h3" className="text-lg font-medium text-surface-900 mb-2">No items found</Title>
                      <Text as="p" className="text-surface-500 mb-4">
{searchTerm || selectedCategory !== 'all' || showAdvancedFilters
                          ? 'Try adjusting your search or filters'
                          : 'Get started by adding your first inventory item'
                        }
                      </Text>
                      {!searchTerm && selectedCategory === 'all' && (
                        <Button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={onAddItem}
                          className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                        >
                          Add First Item
                        </Button>
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
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Text as="div" className="text-sm font-medium text-surface-900 break-words">
                          {item.name}
                        </Text>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.category} className="bg-surface-100 text-surface-800" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Text as="span" className="text-sm text-surface-900">
                            {item.quantity} {item.unit}
                          </Text>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => onQuickUpdate(item.id, 'quantity', Math.max(0, item.quantity - 1))}
                              className="w-6 h-6 bg-surface-100 rounded text-xs hover:bg-surface-200 transition-colors flex items-center justify-center"
                            >
                              -
                            </Button>
                            <Button
                              onClick={() => onQuickUpdate(item.id, 'quantity', item.quantity + 1)}
                              className="w-6 h-6 bg-primary-100 text-primary-600 rounded text-xs hover:bg-primary-200 transition-colors flex items-center justify-center"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={stockStatus.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-600 break-words">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => onEditItem(item)}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            onClick={() => onDeleteItem(item.id)}
                            className="text-error hover:text-red-700 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default InventoryTable