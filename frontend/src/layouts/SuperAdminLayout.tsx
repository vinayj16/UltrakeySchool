import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import RoleSidebar from '../components/RoleSidebar'

const SuperAdminLayout: React.FC = () => {
  return (
    <div className="main-wrapper">
      <Header />
      <RoleSidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default SuperAdminLayout
