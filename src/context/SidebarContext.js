import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    console.log('🔄 Toggle sidebar chamado! Estado atual:', isCollapsed);
    setIsCollapsed(prev => {
      const newState = !prev;
      console.log('📱 Novo estado do sidebar:', newState);
      return newState;
    });
  };

  console.log('🏗️ SidebarProvider renderizado. isCollapsed:', isCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};