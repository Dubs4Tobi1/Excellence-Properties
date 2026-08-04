import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Excellence Property Agencies</div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              Agent: <Link to="/upload" className="hover:text-blue-600 transition-colors">Modupe Femi-Asoro</Link>
            </div>
            <div className="text-gray-500">Call or message for one-on-one support</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
