import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Dashboard = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1">
      <Header />
      <main className="container">
        <h1 className="text-2xl font-bold mb-4">Welcome to SnapSpace Admin Dashboard</h1>
        <p>Quick links and statistics coming soon...</p>
      </main>
    </div>
  </div>
);

export default Dashboard;
