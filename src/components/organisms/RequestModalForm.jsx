import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Text from '@/components/atoms/Text'
import Title from '@/components/atoms/Title'
import FormField from '@/components/molecules/FormField'

const RequestModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  inventoryOptions = [],
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

  const inventorySelectOptions = [
    { value: '', label: 'Select Item' },
    ...inventoryOptions.map(item => ({ 
      value: item.id, 
      label: `${item.name} - ${item.quantity} ${item.unit} available` 
    }))
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
            <Title as="h3" className="text-lg text-surface-900">New Request</Title>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Item" required>
              <Select
                name="itemId"
                value={formData.itemId}
                onChange={handleInputChange}
                options={inventorySelectOptions}
              />
            </FormField>
            
            <FormField label="Quantity" required>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
              />
            </FormField>
            
            <FormField label="Requester" required>
              <Input
                type="text"
                name="requester"
                value={formData.requester}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </FormField>
            
            <FormField label="Department" required>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics, Science Lab"
              />
            </FormField>
            
            <FormField label="Notes">
              <Input
                type="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional information or justification"
                rows="3"
              />
            </FormField>
            
            <div className="flex space-x-3 pt-4">
              <Button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Submit Request
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

export default RequestModalForm