import React from 'react'
import { motion } from 'framer-motion'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const DashboardHeader = ({ title, subtitle, animationProps }) => {
  return (
    <motion.div className="mb-8" {...animationProps}>
      <Title as="h1" className="text-3xl text-surface-900 mb-2">
        {title}
      </Title>
      <Text as="p" className="text-surface-600">
        {subtitle}
      </Text>
    </motion.div>
  )
}

export default DashboardHeader