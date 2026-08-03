import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MyListings from './pages/MyListings'
import ZylusHomes from './pages/ZylusHomes'
import BlueEarthProperties from './pages/BlueEarthProperties'
import PropertyDetails from './pages/PropertyDetails'
import UploadProperty from './pages/UploadProperty'
import AgentDashboard from './pages/AgentDashboard'

const pageTransition = { opacity: { duration: 0.2 } }

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-bg text-gray-800">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadProperty />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/zylus-homes" element={<ZylusHomes />} />
            <Route path="/blue-earth-properties" element={<BlueEarthProperties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/agent/dashboard/*" element={<AgentDashboard />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
