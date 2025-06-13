import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Card from '@/components/molecules/Card'

const AdvancedFilterPanel = ({
  isOpen,
  dateRange,
  onDateRangeChange,
  selectedLocations,
  onLocationChange,
  minStockLevel,
  onMinStockChange,
  availableLocations,
  onClearFilters,
  onApplyFilters
}) => {
  if (!isOpen) return null

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...availableLocations.map(location => ({
      value: location,
      label: location
    }))
  ]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <Card className="mt-4 border-primary-200 border-2">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Filter" size={20} className="text-primary-600" />
              <h3 className="text-lg font-semibold text-surface-900">Advanced Filters</h3>
            </div>
            <Button
              onClick={onClearFilters}
              className="text-sm text-surface-600 hover:text-surface-800 underline"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <FormField label="Date Range">
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => onDateRangeChange('startDate', e.target.value)}
                    placeholder="Start Date"
                    className="w-full"
                  />
                  <Input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => onDateRangeChange('endDate', e.target.value)}
                    placeholder="End Date"
                    className="w-full"
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Location">
              <Select
                value={selectedLocations}
                onChange={onLocationChange}
                options={locationOptions}
                className="w-full"
              />
            </FormField>

            <FormField label="Minimum Stock Level">
              <div className="space-y-2">
                <Input
                  type="number"
                  value={minStockLevel}
                  onChange={onMinStockChange}
                  placeholder="Enter minimum stock"
                  min="0"
                  className="w-full"
                />
                <div className="text-xs text-surface-500">
                  Show items with stock above this level
                </div>
              </div>
            </FormField>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <Button
              onClick={onClearFilters}
              className="px-4 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors"
            >
              Reset
            </Button>
            <Button
              onClick={onApplyFilters}
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AdvancedFilterPanel