import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function PropertyDetails() {
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [property, setProperty] = useState<any>(null)
  const [images, setImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (propertyError) {
        setError(propertyError.message)
        setIsLoading(false)
        return
      }

      setProperty(propertyData)

      const { data: propertyImages, error: imagesError } = await supabase
        .from('property_images')
        .select('url')
        .eq('property_id', id)
        .order('created_at', { ascending: true })

      if (!imagesError) {
        setImages(propertyImages || [])
      }

      setIsLoading(false)
    }

    fetchProperty()
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-white p-8 text-center text-gray-600">Loading property details…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-red-50 border border-red-200 p-6 text-red-700">{error}</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-white p-8 text-center text-gray-600">Property not found.</div>
      </div>
    )
  }

  const primaryImage = property.image_url || images?.[0]?.url || 'https://via.placeholder.com/1200x800'
  const locationLabel = property.locality ? `${property.locality}, ${property.area || property.state}` : property.area || property.state || 'Lagos'

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl overflow-hidden bg-white shadow-sm">
            <img src={primaryImage} alt={property.title} className="w-full h-96 object-cover" />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <p className="text-gray-600">{locationLabel} • {property.status || 'For sale'}</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span>🛏 {property.bedrooms ?? '—'} bedrooms</span>
              <span>🛁 {property.bathrooms ?? '—'} bathrooms</span>
              <span>🚽 {property.toilets ?? '—'} toilets</span>
              <span>🚗 {property.parking ?? '—'} parking</span>
              {property.sqm && <span>{property.sqm} sqm</span>}
            </div>
          </div>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Overview</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div><strong>Category:</strong> {property.category || 'N/A'}</div>
                <div><strong>Type:</strong> {property.property_type || 'N/A'}</div>
                <div><strong>Furnishing:</strong> {property.furnishing || 'N/A'}</div>
                <div><strong>Condition:</strong> {property.condition || 'N/A'}</div>
                <div><strong>Agent:</strong> {property.agent_name || 'Modupe Femi-Asoro'}</div>
                {property.video_url && (
                  <a href={property.video_url} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-primary px-4 py-2 text-primary text-sm hover:bg-primary/5">
                    Watch property video
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Details</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{property.description || 'No description available.'}</p>
            </div>
          </section>

          {property.amenities?.length > 0 && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Facilities & Amenities</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((item: string) => (
                  <span key={item} className="rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-700">{item}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-500">Agent</div>
            <div className="text-lg font-semibold text-gray-900">Modupe Femi-Asoro</div>
            <div className="mt-4 text-xl font-bold text-primary">{property.price ? `N${Number(property.price).toLocaleString()}` : 'Price on request'}</div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowContactMenu((value) => !value)}
                className="w-full rounded-full bg-primary px-4 py-3 text-white font-semibold hover:bg-accent"
              >
                Contact options
              </button>
              {showContactMenu && (
                <div className="mt-3 rounded-xl bg-white text-gray-900 shadow-lg ring-1 ring-black/10">
                  <a
                    href="https://wa.me/2348099513173"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    Chat with WhatsApp
                  </a>
                  <a
                    href="tel:08099513173"
                    className="block px-4 py-3 border-t border-gray-200 hover:bg-gray-100"
                  >
                    Call by phone
                  </a>
                </div>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <h3 className="font-semibold mb-4">More photos</h3>
              <div className="grid gap-3">
                {images.slice(1, 4).map((item) => (
                  <img key={item.url} src={item.url} alt="Property photo" className="w-full h-28 object-cover rounded-xl" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
