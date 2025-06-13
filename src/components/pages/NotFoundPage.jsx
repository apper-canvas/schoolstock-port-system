import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <ApperIcon name="AlertCircle" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <Title as="h1" className="text-3xl text-surface-900 mb-2">
          Page Not Found
        </Title>
        <Text as="p" className="text-surface-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}

export default NotFoundPage