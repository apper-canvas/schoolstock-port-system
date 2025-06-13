import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
import ApperIcon from '../components/ApperIcon'
import inventoryService from '../services/api/inventoryService'
import requestService from '../services/api/requestService'
import categoryService from '../services/api/categoryService'

const Reports = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [requestData, setRequestData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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
          <h3 className="text-xl font-semibold text-surface-900 mb-2">Failed to Load Reports</h3>
          <p className="text-surface-600 mb-6 max-w-md">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalItems = inventoryData.length
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * 10), 0) // Estimated value
  const lowStockItems = inventoryData.filter(item => item.quantity <= item.minStock).length
  const outOfStockItems = inventoryData.filter(item => item.quantity === 0).length
  const totalRequests = requestData.length
  const pendingRequests = requestData.filter(req => req.status === 'pending').length
  const approvedRequests = requestData.filter(req => req.status === 'approved').length
  const fulfilledRequests = requestData.filter(req => req.status === 'fulfilled').length

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
        pendingRequests,
        approvedRequests,
        fulfilledRequests,
        requestData.filter(req => req.status === 'rejected').length
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
      data: [12, 19, 15, 25, 18, 22, 20, 16, 24, 21, 18, 23]
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

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">Reports</h1>
            <p className="text-surface-600 mt-1">
              Analytics and insights for your inventory management
            </p>
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
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Download" size={18} />
              <span>Export</span>
            </motion.button>
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
        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Items</p>
              <p className="text-3xl font-bold text-surface-900">{totalItems}</p>
              <p className="text-xs text-surface-500 mt-1">In inventory</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-7 h-7 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Estimated Value</p>
              <p className="text-3xl font-bold text-surface-900">${totalValue.toLocaleString()}</p>
              <p className="text-xs text-surface-500 mt-1">Total inventory</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-7 h-7 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-warning">{lowStockItems}</p>
              <p className="text-xs text-surface-500 mt-1">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-7 h-7 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Pending Requests</p>
              <p className="text-3xl font-bold text-secondary-500">{pendingRequests}</p>
              <p className="text-xs text-surface-500 mt-1">Awaiting approval</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-7 h-7 text-secondary-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Inventory by Category</h3>
            <ApperIcon name="PieChart" className="w-5 h-5 text-surface-400" />
          </div>
          
          {categoryData.length > 0 ? (
            <Chart
              options={categoryChartData.options}
              series={categoryChartData.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-surface-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2 text-surface-300" />
                <p>No category data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stock Levels */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Current Stock Levels</h3>
            <ApperIcon name="BarChart3" className="w-5 h-5 text-surface-400" />
          </div>
          
          {inventoryData.length > 0 ? (
            <Chart
              options={stockLevelChartData.options}
              series={stockLevelChartData.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-surface-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-2 text-surface-300" />
                <p>No inventory data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Request Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Request Status</h3>
            <ApperIcon name="FileText" className="w-5 h-5 text-surface-400" />
          </div>
          
          {requestData.length > 0 ? (
            <Chart
              options={requestStatusChartData.options}
              series={requestStatusChartData.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-surface-500">
              <div className="text-center">
                <ApperIcon name="FileText" className="w-12 h-12 mx-auto mb-2 text-surface-300" />
                <p>No request data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Request Trend</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-surface-400" />
          </div>
          
          <Chart
            options={monthlyTrendData.options}
            series={monthlyTrendData.series}
            type="line"
            height={300}
          />
        </motion.div>
      </div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200"
      >
        <div className="p-6 border-b border-surface-200">
          <h3 className="text-lg font-semibold text-surface-900">Low Stock Items Summary</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {inventoryData
                .filter(item => item.quantity <= item.minStock)
                .slice(0, 10)
                .map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900 break-words">
                        {item.name}
                      </div>
                      <div className="text-sm text-surface-500 break-words">
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-surface-100 text-surface-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.quantity === 0 
                          ? 'bg-error text-white' 
                          : 'bg-warning text-white'
                      }`}>
                        {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
          
          {inventoryData.filter(item => item.quantity <= item.minStock).length === 0 && (
            <div className="p-12 text-center">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-surface-500">All items are well stocked!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Reports