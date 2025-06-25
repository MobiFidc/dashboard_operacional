import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div id="main-layout" className="layout">
      <Sidebar />
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;