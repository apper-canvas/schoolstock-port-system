import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Title from '@/components/atoms/Title'
import FormField from '@/components/molecules/FormField'

const ItemFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  categoryOptions = [],
}) => {
  if (!isOpen) return null

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const categorySelectOptions = [
    { value: '', label: 'Select Category' },
    ...categoryOptions.map(cat => ({ value: cat.name, label: cat.name }))
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-w-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <Title as="h3" className="text-lg text-surface-900">
              {isEditing ? 'Edit Item' : 'Add New Item'}
            </Title>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Item Name" required>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormField>
            
            <FormField label="Category" required>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categorySelectOptions}
              />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Quantity" required>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormField>
              
              <FormField label="Min Stock" required>
                <Input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormField>
            </div>
            
            <FormField label="Unit" required>
              <Input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="e.g., pieces, boxes, kg"
              />
            </FormField>
            
            <FormField label="Location" required>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Storage Room A, Science Lab"
              />
            </FormField>
            
            <div className="flex space-x-3 pt-4">
              <Button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                {isEditing ? 'Update Item' : 'Add Item'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-100 text-surface-700 py-2 rounded-lg font-semibold hover:bg-surface-200 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ItemFormModal