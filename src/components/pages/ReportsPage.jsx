import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import inventoryService from '@/services/api/inventoryService'
import requestService from '@/services/api/requestService'
import categoryService from '@/services/api/categoryService'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import ReportsChartSection from '@/components/organisms/ReportsChartSection'
import ReportsLowStockSummary from '@/components/organisms/ReportsLowStockSummary'
import MetricStatCard from '@/components/molecules/MetricStatCard'

const ReportsPage = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [requestData, setRequestData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [inventory, requests, categories] = await Promise.all([
        inventoryService.getAll(),
        requestService.getAll(),
        categoryService.getAll()
      ])
      setInventoryData(inventory)
      setRequestData(requests)
      setCategoryData(categories)
    } catch (err) {
      setError(err.message || 'Failed to load reports data')
      toast.error('Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Calculate metrics
  const totalItems = inventoryData.length
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * 10), 0) // Estimated value
  const lowStockItems = inventoryData.filter(item => item.quantity <= item.minStock)
  const outOfStockItems = inventoryData.filter(item => item.quantity === 0)
  const pendingRequestsCount = requestData.filter(req => req.status === 'pending').length
  const approvedRequestsCount = requestData.filter(req => req.status === 'approved').length
  const fulfilledRequestsCount = requestData.filter(req => req.status === 'fulfilled').length
  const rejectedRequestsCount = requestData.filter(req => req.status === 'rejected').length

  // Chart data
  const categoryChartData = {
    series: categoryData.map(category => {
      const categoryItems = inventoryData.filter(item => item.category === category.name)
      return categoryItems.length
    }),
    options: {
      chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif'
      },
      labels: categoryData.map(category => category.name),
      colors: ['#2563EB', '#7C3AED', '#F59E0B', '#10B981', '#EF4444'],
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%'
          }
        }
      }
    }
  }

  const stockLevelChartData = {
    series: [{
      name: 'Stock Level',
      data: inventoryData.slice(0, 10).map(item => ({
        x: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        y: item.quantity
      }))
    }],
    options: {
      chart: {
        type: 'bar',
        fontFamily: 'Inter, sans-serif'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          colors: {
            ranges: [{
              from: 0,
              to: 10,
              color: '#EF4444'
            }, {
              from: 11,
              to: 50,
              color: '#F59E0B'
            }, {
              from: 51,
              to: 1000,
              color: '#10B981'
            }]
          }
        }
      },
      xaxis: {
        title: {
          text: 'Quantity'
        }
      },
      yaxis: {
        title: {
          text: 'Items'
        }
      }
    }
  }

  const requestStatusChartData = {
    series: [{
      name: 'Requests',
      data: [
        pendingRequestsCount,
        approvedRequestsCount,
        fulfilledRequestsCount,
        rejectedRequestsCount
      ]
    }],
    options: {
      chart: {
        type: 'bar',
        fontFamily: 'Inter, sans-serif'
      },
      xaxis: {
        categories: ['Pending', 'Approved', 'Fulfilled', 'Rejected']
      },
      colors: ['#F59E0B', '#10B981', '#2563EB', '#EF4444'],
      plotOptions: {
        bar: {
          distributed: true
        }
      },
      legend: {
        show: false
      }
    }
  }

  const monthlyTrendData = {
    series: [{
      name: 'Requests',
      data: [12, 19, 15, 25, 18, 22, 20, 16, 24, 21, 18, 23] // Mock data as original
    }],
    options: {
      chart: {
        type: 'line',
        fontFamily: 'Inter, sans-serif'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      colors: ['#2563EB'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 6
      }
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-200 rounded"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-surface-200 rounded"></div>
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
          <Title as="h3" className="text-xl font-semibold text-surface-900 mb-2">Failed to Load Reports</Title>
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
            <Title as="h1" className="text-3xl text-surface-900">Reports</Title>
            <Text as="p" className="text-surface-600 mt-1">
              Analytics and insights for your inventory management
            </Text>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Download" size={18} />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricStatCard
          title="Total Items"
          value={totalItems}
          subtitle="In inventory"
          icon="Package"
          iconBgColor="bg-primary-100"
          iconColor="text-primary-500"
        />
        <MetricStatCard
          title="Estimated Value"
          value={`$${totalValue.toLocaleString()}`}
          subtitle="Total inventory"
          icon="DollarSign"
          iconBgColor="bg-success/10"
          iconColor="text-success"
        />
        <MetricStatCard
          title="Low Stock Alerts"
          value={lowStockItems.length}
          subtitle="Need attention"
          icon="AlertTriangle"
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
        />
        <MetricStatCard
          title="Pending Requests"
          value={pendingRequestsCount}
          subtitle="Awaiting approval"
          icon="Clock"
          iconBgColor="bg-secondary-100"
          iconColor="text-secondary-500"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChartSection
          title="Inventory by Category"
          icon="PieChart"
          chartOptions={categoryChartData.options}
          chartSeries={categoryChartData.series}
          chartType="donut"
          noDataMessage="No category data available"
          hasData={categoryData.length > 0}
          animationProps={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 } }}
        />

        <ReportsChartSection
          title="Current Stock Levels"
          icon="BarChart3"
          chartOptions={stockLevelChartData.options}
          chartSeries={stockLevelChartData.series}
          chartType="bar"
          noDataMessage="No inventory data available"
          hasData={inventoryData.length > 0}
          animationProps={{ initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3 } }}
        />

        <ReportsChartSection
          title="Request Status"
          icon="FileText"
          chartOptions={requestStatusChartData.options}
          chartSeries={requestStatusChartData.series}
          chartType="bar"
          noDataMessage="No request data available"
          hasData={requestData.length > 0}
          animationProps={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4 } }}
        />

        <ReportsChartSection
          title="Request Trend"
          icon="TrendingUp"
          chartOptions={monthlyTrendData.options}
          chartSeries={monthlyTrendData.series}
          chartType="line"
          noDataMessage="No trend data available"
          hasData={true} // Monthly trend data is hardcoded for now
          animationProps={{ initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.5 } }}
        />
      </div>

      <ReportsLowStockSummary lowStockItems={lowStockItems} />
    </div>
  )
}

export default ReportsPage