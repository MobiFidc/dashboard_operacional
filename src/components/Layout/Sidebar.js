import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Settings, 
  BarChart3, 
  HelpCircle,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, hasPermission } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  console.log('🎯 Sidebar renderizado. isCollapsed:', isCollapsed);

  const menuItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
      permission: null
    },
    {
      path: '/conferencia-notas',
      icon: FileText,
      label: 'Conferência de Notas',
      permission: 'conferencia_notas'
    },
    {
      path: '/suporte',
      icon: HelpCircle,
      label: 'Suporte',
      permission: 'suporte'
    },
    {
      path: '/relatorios',
      icon: BarChart3,
      label: 'Relatórios',
      permission: 'relatorios'
    },
    {
      path: '/admin',
      icon: Settings,
      label: 'Administração',
      permission: 'admin'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div 
      id="main-sidebar" 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
    >
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="header-content">
            <h2>Dashboard</h2>
            <span className="sidebar-subtitle">Operacional</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="toggle-btn"
          title={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav 
        id="sidebar-nav" 
        className="sidebar-nav"
      >
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name">{user?.fullName}</div>
              <div className="user-type">{user?.userType}</div>
            </div>
          )}
        </div>
        <button 
          onClick={logout} 
          className="logout-btn"
          title={isCollapsed ? 'Sair' : ''}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;