import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import Text from '@/components/atoms/Text'

const MetricStatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  className = '',
  ...motionProps
}) => {
  return (
    <Card className={`p-6 ${className}`} {...motionProps}>
      <div className="flex items-center justify-between">
        <div>
          <Text as="p" className="text-sm font-medium text-surface-600">
            {title}
          </Text>
          <Text as="p" className="text-3xl font-bold text-surface-900">
            {value}
          </Text>
          <Text as="p" className="text-xs text-surface-500 mt-1">
            {subtitle}
          </Text>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
          <ApperIcon name={icon} className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
    </Card>
  )
}

export default MetricStatCard