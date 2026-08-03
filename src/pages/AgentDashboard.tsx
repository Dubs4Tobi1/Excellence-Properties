import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import UploadProperty from './UploadProperty'

export default function AgentDashboard() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <aside className="lg:col-span-1 bg-white p-4 rounded shadow-sm">
          <div className="font-bold mb-4">Agent Dashboard</div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/agent/dashboard">Overview</Link>
            <Link to="/agent/dashboard/upload">Upload Property</Link>
            <Link to="/agent/dashboard/manage">Manage Listings</Link>
            <Link to="/agent/dashboard/analytics">Analytics</Link>
            <Link to="/agent/dashboard/settings">Settings</Link>
          </nav>
        </aside>
        <main className="lg:col-span-5 bg-white p-6 rounded shadow-sm">
          <Routes>
            <Route path="/" element={<div>Welcome to your dashboard</div>} />
            <Route path="upload" element={<UploadProperty />} />
            <Route path="manage" element={<div>Manage listings (coming)</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
