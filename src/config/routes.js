import Dashboard from '../pages/Dashboard'
import Inventory from '../pages/Inventory'
import Requests from '../pages/Requests'
import Reports from '../pages/Reports'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: Inventory
  },
  requests: {
    id: 'requests',
    label: 'Requests',
    path: '/requests',
    icon: 'FileText',
    component: Requests
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound
  }
}

export const routeArray = Object.values(routes)
export const navigationRoutes = [routes.dashboard, routes.inventory, routes.requests, routes.reports]