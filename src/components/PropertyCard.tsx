import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type Props = {
  property: any
}

export default function PropertyCard({ property }: Props) {
  const locationLabel = property.area || property.locality || property.state || property.location || 'Lagos'
  const imageSrc = property.image_url || property.image || ''

  return (
    <motion.article whileHover={{ y: -6 }} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <Link to={`/property/${property.id}`}>
        <div className="relative h-48 bg-white">
          {imageSrc ? <img src={imageSrc} alt={property.title || 'Property'} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" /> : <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">Photos coming soon</div>}
          {property.video_url && <span className="absolute bottom-3 left-3 rounded-full bg-gray-900/80 px-3 py-1 text-xs text-white">Video tour available</span>}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{property.title || 'Beautiful Property'}</h3>
        <div className="text-primary font-bold mt-1">{property.price ? `₦${Number(property.price).toLocaleString()}` : 'Price on request'}</div>
        <div className="text-sm text-gray-500 mt-2">{locationLabel}</div>
        <div className="mt-3 flex gap-2 text-xs text-gray-600">
          <div>🛏 {property.bedrooms ?? 0}</div>
          <div>🛁 {property.bathrooms ?? 0}</div>
          <div>🚗 {property.parking ?? 0}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/property/${property.id}`} className="flex-1 text-center py-2 border rounded">View Details</Link>
          <a href={`https://wa.me/2348099513173?text=Hello,%20I%20saw%20this%20property%20on%20your%20website%20and%20I'm%20interested.`} target="_blank" rel="noreferrer" className="bg-accent px-3 py-2 rounded text-white">WhatsApp</a>
        </div>
      </div>
    </motion.article>
  )
}
