import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'
import FormField from '@/components/molecules/FormField'

const FilterControls = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [], // for inventory
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  bulkDeleteButton,
  className = '',
  animationProps = {} // for motion properties on the container
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ]

  const inventorySortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'lastUpdated', label: 'Last Updated' }
  ]

  const requestSortOptions = [
    { value: 'requestDate', label: 'Date' },
    { value: 'requester', label: 'Requester' },
    { value: 'status', label: 'Status' }
  ]

  const isInventoryFilter = categories.length > 0 // Heuristic to determine if it's inventory or requests filter

  return (
    <Card className={`p-6 ${className}`} {...animationProps}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField label="Search">
          <Input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search items..."
            icon="Search"
          />
        </FormField>
        
        {isInventoryFilter && (
          <FormField label="Category">
            <Select
              value={selectedCategory}
              onChange={onCategoryChange}
              options={categoryOptions}
            />
          </FormField>
        )}
        
        <FormField label="Sort By">
          <Select
            value={sortBy}
            onChange={onSortByChange}
            options={isInventoryFilter ? inventorySortOptions : requestSortOptions}
          />
        </FormField>
        
        <div className="flex items-end space-x-2">
          <Button
            onClick={onSortOrderToggle}
            className="px-4 py-2 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
          </Button>
          
          {bulkDeleteButton}
        </div>
      </div>
    </Card>
  )
}

export default FilterControls