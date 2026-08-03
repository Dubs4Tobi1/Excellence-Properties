import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { motion, useScroll, useTransform } from 'framer-motion'
import logo from './EXCELLENCE.png'

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { scrollY } = useScroll()
  const height = useTransform(scrollY, [0, 100], [96, 64])

  return (
    <motion.header style={{ height }} className="sticky top-0 z-40 bg-white/60 backdrop-blur glass drop-shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full py-3">
          <div className="flex items-center gap-4 h-full">
            <Link to="/" className="h-20 w-36 sm:w-48 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link to="/" className="text-sm font-medium">Home</Link>
              <Link to="/my-listings" className="text-sm">My Listings</Link>
              <Link to="/zylus-homes" className="text-sm">Zylus Homes</Link>
              <Link to="/blue-earth-properties" className="text-sm">Blue Earth Properties</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setShowMobileMenu((current) => !current)}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 md:hidden"
            >
              {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 pb-4 pt-2 space-y-2 sm:px-6">
            <Link
              to="/"
              className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/my-listings"
              className="block rounded-xl px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              My Listings
            </Link>
            <Link
              to="/zylus-homes"
              className="block rounded-xl px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Zylus Homes
            </Link>
            <Link
              to="/blue-earth-properties"
              className="block rounded-xl px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Blue Earth Properties
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  )
}
