import DashboardPage from '@/components/pages/DashboardPage'
import InventoryPage from '@/components/pages/InventoryPage'
import RequestsPage from '@/components/pages/RequestsPage'
import ReportsPage from '@/components/pages/ReportsPage'
import HomePage from '@/components/pages/HomePage'
import NotFoundPage from '@/components/pages/NotFoundPage'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
component: InventoryPage
  },
  requests: {
    id: 'requests',
    label: 'Requests',
    path: '/requests',
    icon: 'FileText',
component: RequestsPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
component: ReportsPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
component: NotFoundPage
  }
}

export const routeArray = Object.values(routes)
export const navigationRoutes = [routes.dashboard, routes.inventory, routes.requests, routes.reports]