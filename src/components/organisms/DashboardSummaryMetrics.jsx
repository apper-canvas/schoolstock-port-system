import React from 'react'
import MetricStatCard from '@/components/molecules/MetricStatCard'

const DashboardSummaryMetrics = ({
  totalItems,
  lowStockCount,
  pendingRequestsCount,
  categoryCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricStatCard
        title="Total Items"
        value={totalItems}
        subtitle="Across all categories"
        icon="Package"
        iconBgColor="bg-primary-100"
        iconColor="text-primary-500"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      />
      <MetricStatCard
        title="Low Stock"
        value={lowStockCount}
        subtitle="Need replenishment"
        icon="TrendingDown"
        iconBgColor="bg-warning/10"
        iconColor="text-warning"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      />
      <MetricStatCard
        title="Pending Requests"
        value={pendingRequestsCount}
        subtitle="Awaiting approval"
        icon="Clock"
        iconBgColor="bg-secondary-100"
        iconColor="text-secondary-500"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      />
      <MetricStatCard
        title="Categories"
        value={categoryCount}
        subtitle="Item types"
        icon="Grid3X3"
        iconBgColor="bg-surface-100"
        iconColor="text-surface-600"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  )
}

export default DashboardSummaryMetrics