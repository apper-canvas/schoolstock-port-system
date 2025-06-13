import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import Card from '@/components/molecules/Card'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Package" className="w-12 h-12 text-white" />
          </div>
          <Title as="h1" className="text-4xl text-surface-900 mb-4">
            SchoolStock Pro
          </Title>
          <Text as="p" className="text-lg text-surface-600 mb-8">
            Comprehensive inventory management for educational institutions. 
            Track supplies, manage requests, and optimize resource allocation.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6">
            <ApperIcon name="BarChart3" className="w-8 h-8 text-primary-500 mb-4" />
            <Title as="h3" className="font-semibold text-surface-900 mb-2">Smart Analytics</Title>
            <Text as="p" className="text-sm text-surface-600">
              Real-time insights into stock levels and usage patterns
            </Text>
          </Card>
          
          <Card className="p-6">
            <ApperIcon name="Bell" className="w-8 h-8 text-accent-500 mb-4" />
            <Title as="h3" className="font-semibold text-surface-900 mb-2">Low Stock Alerts</Title>
            <Text as="p" className="text-sm text-surface-600">
              Automated notifications when supplies need replenishment
            </Text>
          </Card>
          
          <Card className="p-6">
            <ApperIcon name="Users" className="w-8 h-8 text-secondary-500 mb-4" />
            <Title as="h3" className="font-semibold text-surface-900 mb-2">Request Workflow</Title>
            <Text as="p" className="text-sm text-surface-600">
              Streamlined approval process for staff resource requests
            </Text>
          </Card>
        </motion.div>

        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  )
}

export default HomePage