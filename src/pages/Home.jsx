import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
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
          <h1 className="text-4xl font-heading font-bold text-surface-900 mb-4">
            SchoolStock Pro
          </h1>
          <p className="text-lg text-surface-600 mb-8">
            Comprehensive inventory management for educational institutions. 
            Track supplies, manage requests, and optimize resource allocation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <ApperIcon name="BarChart3" className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="font-semibold text-surface-900 mb-2">Smart Analytics</h3>
            <p className="text-sm text-surface-600">
              Real-time insights into stock levels and usage patterns
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <ApperIcon name="Bell" className="w-8 h-8 text-accent-500 mb-4" />
            <h3 className="font-semibold text-surface-900 mb-2">Low Stock Alerts</h3>
            <p className="text-sm text-surface-600">
              Automated notifications when supplies need replenishment
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <ApperIcon name="Users" className="w-8 h-8 text-secondary-500 mb-4" />
            <h3 className="font-semibold text-surface-900 mb-2">Request Workflow</h3>
            <p className="text-sm text-surface-600">
              Streamlined approval process for staff resource requests
            </p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Home