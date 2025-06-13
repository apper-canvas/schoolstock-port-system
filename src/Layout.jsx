import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { navigationRoutes } from './config/routes'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-50">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-heading font-bold text-lg text-surface-900">
                SchoolStock Pro
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="pl-10 pr-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
            
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-surface-200 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navigationRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 overflow-y-auto"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Package" className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-heading font-bold text-lg text-surface-900">
                        SchoolStock Pro
                      </span>
                    </div>
                    <button
                      onClick={toggleMobileMenu}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  <nav className="space-y-1">
                    {navigationRoutes.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={18} />
                        <span>{route.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout