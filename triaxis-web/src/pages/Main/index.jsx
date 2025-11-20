
import React from 'react'
import { Outlet } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from '../../components/SideBar';
import SiteFooter from '../../components/SiteFooter';
import Header from '../../components/Header';

export default function Main() {
  return (
    <div className="min-h-screen bg-main">
      <Header />
      <main className="pt-20 relative">
        <ReactFlowProvider>
          <Outlet />
        </ReactFlowProvider>
        <Sidebar />
      </main>
      <SiteFooter />
    </div>
  );
}
