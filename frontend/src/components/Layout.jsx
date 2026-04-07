import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopNav />
      
      {/* Main Content Area */}
      <div className="pt-24 pb-24 md:pb-8 md:pl-80 w-full min-h-screen relative">
        <main className="max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
