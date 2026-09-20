import Login from './pages/Authentication/Login'
import RegisterPage from './pages/Authentication/Registration'
import ForgotPassword from './pages/Authentication/ForgotPassword'
import ManagerDashboard from './pages/Manager/Dashboard'
import { Navigate, Route, Routes } from 'react-router-dom'
import TechnicianDashboard from './pages/Technician/Dashboard'
import WorkOrders from './pages/Manager/WorkOrder'
import Customers from './pages/Manager/Customer'
import AssignWorkOrder from './pages/Manager/AssignWorkOrder'
import Inventory from './pages/Manager/Inventory'
import ManagerProfile from './pages/Manager/Profile'
import UpdateStock from './pages/Manager/UpdateStock'
import AddPart from './pages/Manager/AddPart'
import AddCustomer from './pages/Manager/AddCustomer'
import CustomerDashboard from './pages/Customer/Dashboard'
import MyRequests from './pages/Customer/MyRequest'
import CreateRequest from './pages/Customer/CreateRequest'
import RequestInfo from './pages/Customer/RequestInfo'
import DispatcherDashboard from './pages/Dispatcher/Dashboard'
import DispatcherWorkOrders from './pages/Dispatcher/WorkOrder'
import DispatcherCustomers from './pages/Dispatcher/Customer'
import DispatcherTechnicians from './pages/Dispatcher/User'
import DispatcherAssignWorkOrder from './pages/Dispatcher/AssignWorkOrder'
import DispatcherWorkDetails from './pages/Dispatcher/WorkDetails'
import DispatcherProfile from './pages/Dispatcher/Profile'
import DispatcherAddCustomer from './pages/Dispatcher/AddCustomer'
import DispatcherInventory from './pages/Dispatcher/Inventory'
import DispatcherSiteManagement from './pages/Dispatcher/SiteManagement'
import DispatcherEditCustomer from './pages/Dispatcher/EditCustomer'
import DispatcherCreateSite from './pages/Dispatcher/CreateSite'
import DispatcherUpdateSite from './pages/Dispatcher/UpdateSite'
import DispatcherUpdateWorkOrder from './pages/Dispatcher/UpdateWorkOrder'
import DispatcherCreateWorkOrder from './pages/Dispatcher/CreateWorkOrder'
import TechnicianProfile from './pages/Technician/Profile'
import TechnicianJobDetails from './pages/Technician/TechnicianJobDetails'
import TechnicianStartWork from './pages/Technician/StartWork'
import TechnicianHoldWork from './pages/Technician/HoldWork'
import TechnicianCompleteWork from './pages/Technician/CompleteWork'
import TechnicianInventory from './pages/Technician/Inventory'
import UpdateSite from './pages/Manager/UpdateSite'
import UserManagement from './pages/Manager/UserManagement'
import CreateUser from './pages/Manager/CreateUser'
import EditUser from './pages/Manager/EditUser'
import SiteManagements from './pages/Manager/SiteManagements'
import CreateSite from './pages/Manager/CreateSite'
import WorkOrderDetail from './pages/Manager/WorkDetails'
import UpdateWorkOrder from './pages/Manager/UpdateWorkOrder'
import EditCustomer from './pages/Manager/EditCustomer'
import CreateWork from './pages/Manager/CreateWork'
import ResetPassword from './pages/Authentication/ResetPassword'

type ProtectedRouteProps = {
  allowedRole: string
  children: React.ReactNode
}

function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token || role !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/Manager/Dashboard"
        element={
          <ProtectedRoute allowedRole="MANAGER">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Technician/Dashboard"
        element={
          <ProtectedRoute allowedRole="TECHNICIAN">
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Dispatcher/Dashboard"
        element={
          <ProtectedRoute allowedRole="DISPATCHER">
            <DispatcherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Customer/Dashboard"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/Manager/WorkOrders" element={<Protected */}
      <Route path="/Technician/Profile" element={<ProtectedRoute allowedRole="TECHNICIAN"><TechnicianProfile /></ProtectedRoute>} />
      <Route path="/Technician/JobDetails/:workCode" element={<ProtectedRoute allowedRole="TECHNICIAN"><TechnicianJobDetails /></ProtectedRoute>} />
      <Route path="/Technician/StartWork/:workCode" element={<ProtectedRoute allowedRole="TECHNICIAN"><TechnicianStartWork /></ProtectedRoute>} />
      <Route path="/Technician/HoldWork" element={<ProtectedRoute allowedRole="TECHNICIAN"><TechnicianHoldWork /></ProtectedRoute>} />
      <Route path="/Technician/CompleteWork/:workCode" element={<ProtectedRoute allowedRole="TECHNICIAN"><TechnicianCompleteWork /></ProtectedRoute>} />
      <Route path="/Technician/Inventory" element={<ProtectedRoute allowedRole="TECHNICIAN"><TechnicianInventory /></ProtectedRoute>} />

      <Route path="/Customer/Dashboard" element={<ProtectedRoute allowedRole="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/Customer/MyRequests" element={<ProtectedRoute allowedRole="CUSTOMER"><MyRequests /></ProtectedRoute>} />
      <Route path="/Customer/RequestInfo/:id" element={<ProtectedRoute allowedRole="CUSTOMER"><RequestInfo /></ProtectedRoute>} />
      <Route path="/Customer/CreateRequest" element={<ProtectedRoute allowedRole="CUSTOMER"><CreateRequest /></ProtectedRoute>} />
      
      <Route path="/Dispatcher/Dashboard" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherDashboard /></ProtectedRoute>} />
      <Route path="/Dispatcher/WorkOrders" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherWorkOrders /></ProtectedRoute>} />
      <Route path="/Dispatcher/Customers" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherCustomers /></ProtectedRoute>} />
      <Route path="/Dispatcher/AddCustomer" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherAddCustomer /></ProtectedRoute>} />
      <Route path="/Dispatcher/Technicians" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherTechnicians /></ProtectedRoute>} />
      <Route path="/Dispatcher/Inventory" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherInventory /></ProtectedRoute>} />
      <Route path="/Dispatcher/AssignWorkOrder/:workCode" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherAssignWorkOrder /></ProtectedRoute>} />
      <Route path="/Dispatcher/WorkDetails/:workCode" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherWorkDetails /></ProtectedRoute>} />
      <Route path="/Dispatcher/CreateWorkOrder" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherCreateWorkOrder /></ProtectedRoute>} />
      <Route path="/Dispatcher/Profile" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherProfile /></ProtectedRoute>} />
      <Route path="/Dispatcher/SiteManagement" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherSiteManagement /></ProtectedRoute>} />
      <Route path="/Dispatcher/EditCustomer/:id" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherEditCustomer /></ProtectedRoute>} />
      <Route path="/Dispatcher/CreateSite" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherCreateSite /></ProtectedRoute>} />
      <Route path="/Dispatcher/UpdateSite/:id" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherUpdateSite /></ProtectedRoute>} />
      <Route path="/Dispatcher/UpdateWorkOrder/:id" element={<ProtectedRoute allowedRole="DISPATCHER"><DispatcherUpdateWorkOrder /></ProtectedRoute>} />

      <Route path="/Manager/WorkOrders" element={<ProtectedRoute allowedRole="MANAGER"><WorkOrders /></ProtectedRoute>} />
      <Route path="/Manager/WorkDetails/:workCode" element={<ProtectedRoute allowedRole="MANAGER"><WorkOrderDetail /></ProtectedRoute>} />
      <Route path="/Manager/UpdateWorkOrder" element={<ProtectedRoute allowedRole="MANAGER"><UpdateWorkOrder /></ProtectedRoute>} />
      <Route path="/Manager/Customers" element={<ProtectedRoute allowedRole="MANAGER"><Customers /></ProtectedRoute>} />
      <Route path="/Manager/AddCustomer" element={<ProtectedRoute allowedRole="MANAGER"><AddCustomer /></ProtectedRoute>} />
      <Route path="/Manager/EditCustomer/:id" element={<ProtectedRoute allowedRole="MANAGER"><EditCustomer /></ProtectedRoute>} />
      <Route path="/Manager/AssignWorkOrder/:workCode" element={<ProtectedRoute allowedRole="MANAGER"><AssignWorkOrder /></ProtectedRoute>} />
      <Route path="/Manager/CreateWork" element={<ProtectedRoute allowedRole='MANAGER'><CreateWork /></ProtectedRoute>} />
      <Route path="/Manager/Inventory" element={<ProtectedRoute allowedRole="MANAGER"><Inventory /></ProtectedRoute>} />
      <Route path="/Manager/Inventory/UpdateStock" element={<ProtectedRoute allowedRole="MANAGER"><UpdateStock /></ProtectedRoute>} />
      <Route path="/Manager/Inventory/AddPart" element={<ProtectedRoute allowedRole="MANAGER"><AddPart /></ProtectedRoute>} />
      <Route path="/Manager/Profile" element={<ProtectedRoute allowedRole="MANAGER"><ManagerProfile /></ProtectedRoute>} />
      <Route path="/Manager/SiteManagements" element={<ProtectedRoute allowedRole="MANAGER"><SiteManagements /></ProtectedRoute>} />
      <Route path="/Manager/CreateSite" element={<ProtectedRoute allowedRole="MANAGER"><CreateSite /></ProtectedRoute>} />
      <Route path="/Manager/UpdateSite/:id" element={<ProtectedRoute allowedRole="MANAGER"><UpdateSite /></ProtectedRoute>} />
      <Route path="/Manager/UserManagement" element={<ProtectedRoute allowedRole="MANAGER"><UserManagement /></ProtectedRoute>} />
      <Route path="/Manager/CreateUser" element={<ProtectedRoute allowedRole="MANAGER"><CreateUser /></ProtectedRoute>} />
      <Route path="/Manager/EditUser/:id" element={<ProtectedRoute allowedRole="MANAGER"><EditUser /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
