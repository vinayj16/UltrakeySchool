import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedSidebar from '../components/EnhancedSidebar';

const EnhancedInstitutionLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="main-wrapper">
      <EnhancedSidebar 
        collapsed={isSidebarCollapsed} 
        onCollapse={setIsSidebarCollapsed} 
      />
      <div 
        className={`page-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}
        style={{
          marginLeft: isSidebarCollapsed ? '80px' : '280px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: `calc(100% - ${isSidebarCollapsed ? '80px' : '280px'})`,
          position: 'relative',
          backgroundColor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EnhancedInstitutionLayout;
