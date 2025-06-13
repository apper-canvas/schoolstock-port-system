import React from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const ReportsChartSection = ({
  title,
  icon,
  chartOptions,
  chartSeries,
  chartType,
  height = 300,
  noDataMessage,
  hasData,
  animationProps = {}
}) => {
  return (
    <Card className="p-6" {...animationProps}>
      <div className="flex items-center justify-between mb-6">
        <Title as="h3" className="text-lg text-surface-900">{title}</Title>
        <ApperIcon name={icon} className="w-5 h-5 text-surface-400" />
      </div>
      
      {hasData ? (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type={chartType}
          height={height}
        />
      ) : (
        <div className="h-80 flex items-center justify-center text-surface-500">
          <div className="text-center">
            <ApperIcon name={icon} className="w-12 h-12 mx-auto mb-2 text-surface-300" />
            <Text as="p">{noDataMessage}</Text>
          </div>
        </div>
      )}
    </Card>
  )
}

export default ReportsChartSection