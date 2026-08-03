import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import PropertyCard from '../components/PropertyCard'

export default function MyListings() {
  const [filterArea, setFilterArea] = useState('')
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      setError(null)

      let query = supabase.from('properties').select('*').order('created_at', { ascending: false })
      if (filterArea) {
        query = query.ilike('area', `%${filterArea}%`)
      }

      const { data, error } = await query
      if (error) {
        setError(error.message)
        setProperties([])
      } else {
        setProperties(data || [])
      }

      setIsLoading(false)
    }

    fetchProperties()
  }, [filterArea])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <p className="text-sm text-gray-600">Properties listed under Excellence Property Agencies</p>
      </header>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4 items-end">
        <div>
          <p className="text-sm text-gray-700">Filter properties by area to narrow your search.</p>
          <p className="mt-2 text-sm text-gray-500">{properties.length} listing{properties.length === 1 ? '' : 's'} found.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Area filter</label>
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All areas</option>
            <optgroup label="Lagos Island">
              <option>Lagos Island</option>
              <option>Victoria Island (VI)</option>
              <option>Ikoyi</option>
              <option>Lekki Phase 1</option>
              <option>Lekki Phase 2</option>
              <option>Ajah</option>
              <option>Sangotedo</option>
              <option>Abraham Adesanya</option>
              <option>Chevron</option>
              <option>VGC</option>
              <option>Ikate</option>
              <option>Osapa London</option>
              <option>Oniru</option>
              <option>Banana Island</option>
              <option>Ibeju-Lekki</option>
              <option>Awoyaya</option>
              <option>Lakowe</option>
              <option>Bogije</option>
              <option>Eleko</option>
              <option>Epe</option>
            </optgroup>
            <optgroup label="Ikeja Axis">
              <option>Ikeja GRA</option>
              <option>Alausa</option>
              <option>Oregun</option>
              <option>Maryland</option>
              <option>Ogba</option>
              <option>Ojodu</option>
              <option>Berger</option>
              <option>Omole</option>
              <option>Magodo</option>
              <option>Opebi</option>
              <option>Allen Avenue</option>
              <option>Computer Village</option>
              <option>Agidingbi</option>
            </optgroup>
            <optgroup label="Mainland">
              <option>Yaba</option>
              <option>Sabo</option>
              <option>Akoka</option>
              <option>Bariga</option>
              <option>Somolu</option>
              <option>Fadeyi</option>
              <option>Mushin</option>
              <option>Surulere</option>
              <option>Ojuelegba</option>
              <option>Bode Thomas</option>
              <option>Lawanson</option>
              <option>Itire</option>
              <option>Ijesha</option>
              <option>Orile</option>
              <option>Ebute Metta</option>
              <option>Adekunle</option>
              <option>Makoko</option>
              <option>Apapa</option>
              <option>Ijora</option>
              <option>Costain</option>
            </optgroup>
            <optgroup label="Oshodi / Airport Axis">
              <option>Oshodi</option>
              <option>Isolo</option>
              <option>Ajao Estate</option>
              <option>Mafoluku</option>
              <option>Ilasamaja</option>
              <option>Ejigbo</option>
              <option>Shasha</option>
              <option>Airport Road</option>
            </optgroup>
            <optgroup label="Agege / Alimosho Axis">
              <option>Agege</option>
              <option>Dopemu</option>
              <option>Abule Egba</option>
              <option>Iyana Ipaja</option>
              <option>Egbeda</option>
              <option>Idimu</option>
              <option>Ikotun</option>
              <option>Igando</option>
              <option>Ayobo</option>
              <option>Ipaja</option>
              <option>Akowonjo</option>
              <option>Alagbado</option>
              <option>Command</option>
              <option>Meiran</option>
              <option>Gowon Estate</option>
              <option>Isheri-Olofin</option>
            </optgroup>
            <optgroup label="Kosofe / Ketu Axis">
              <option>Ketu</option>
              <option>Mile 12</option>
              <option>Kosofe</option>
              <option>Ikosi</option>
              <option>Agboyi</option>
              <option>Oworonshoki</option>
              <option>Anthony</option>
              <option>Gbagada</option>
            </optgroup>
            <optgroup label="Badagry / Ojo Axis">
              <option>Ojo</option>
              <option>Festac Town</option>
              <option>Amuwo Odofin</option>
              <option>Satellite Town</option>
              <option>Trade Fair</option>
              <option>Okokomaiko</option>
              <option>Ijanikin</option>
              <option>Badagry</option>
            </optgroup>
            <optgroup label="Ikorodu Axis">
              <option>Ikorodu Town</option>
              <option>Agric</option>
              <option>Igbogbo</option>
              <option>Imota</option>
              <option>Isawo</option>
              <option>Odogunyan</option>
              <option>Ebute</option>
              <option>Owutu</option>
            </optgroup>
            <optgroup label="Other Common Areas">
              <option>Ilupeju</option>
              <option>Palmgrove</option>
              <option>Anthony Village</option>
              <option>Dolphin Estate</option>
              <option>Jakande (Lekki)</option>
              <option>Agungi</option>
              <option>Jakande Estate (Isolo)</option>
              <option>Marina</option>
              <option>Obalende</option>
              <option>CMS</option>
              <option>Onikan</option>
            </optgroup>
          </select>
        </div>
      </div>

      {error && <div className="mb-6 rounded-3xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}
      {isLoading ? (
        <div className="rounded-3xl bg-white p-8 text-center text-gray-600">Loading listings…</div>
      ) : properties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 text-center text-gray-600">
          No listings available.
          {filterArea && <p className="mt-2 text-sm text-gray-500">Try a different area or clear the filter.</p>}
        </div>
      )}
    </div>
  )
}
