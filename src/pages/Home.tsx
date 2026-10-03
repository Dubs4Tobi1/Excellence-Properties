import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiSearch, FiMapPin } from 'react-icons/fi'
import { supabase } from '../lib/supabaseClient'
import PropertyCard from '../components/PropertyCard'

export default function Home() {
  const [properties, setProperties] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [area, setArea] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    supabase.from('properties').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!active) return
      setProperties(data || []); setError(error ? 'We could not load properties. Please try again.' : ''); setLoading(false)
    })
    return () => { active = false }
  }, [reload])
  const filtered = properties.filter(property => {
    const text = [property.title, property.area, property.locality, property.reference].join(' ').toLowerCase()
    return text.includes(query.toLowerCase().trim()) && (!category || property.category === category) &&
      (!area || property.area === area) && (!maxPrice || (property.price != null && Number(property.price) <= Number(maxPrice)))
  })
  const areas = [...new Set(properties.map(p => p.area).filter(Boolean))].sort()
  const categories = [...new Set(properties.map(p => p.category).filter(Boolean))].sort()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <section className="relative rounded-[2rem] bg-gray-900 text-white overflow-hidden p-7 sm:p-12 lg:p-16">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-primary/30 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-yellow-400">Excellence Property Agencies</p>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-tight tracking-tight">A place to live.<br /><span className="text-yellow-400">A future to build.</span></h1>
          <p className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed">Explore homes, land and commercial spaces in Lagos. Find your next property with guidance from our agency.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#properties" className="inline-flex items-center gap-3 rounded-full bg-yellow-400 text-gray-900 font-semibold px-6 py-3">Explore properties <FiArrowUpRight /></a>
            <a href="https://wa.me/2348099513173" target="_blank" rel="noreferrer" className="rounded-full border border-white/30 px-6 py-3">Speak to an agent</a>
          </div>
        </div>
        <div className="relative mt-12 grid gap-5 border-t border-white/15 pt-6 sm:grid-cols-3 text-sm text-gray-300">
          <span>Homes for sale & rent</span><span>Land & investment opportunities</span><span>Property tours & personal support</span>
        </div>
      </section>
      <section id="properties" className="scroll-mt-28 mt-12">
        <div className="flex flex-wrap gap-4 items-end justify-between mb-6">
          <div><p className="text-sm uppercase tracking-widest text-primary">Discover your next move</p><h2 className="mt-2 text-3xl font-semibold">Explore our properties</h2></div>
          <Link to="/my-listings" className="text-sm font-semibold text-primary">View all listings →</Link>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-medium">Search<div className="mt-2 flex items-center gap-2 border rounded-xl px-3"><FiSearch /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Location, title or reference" className="w-full py-3 outline-none" /></div></label>
          <label className="text-sm font-medium">Category<select value={category} onChange={e => setCategory(e.target.value)} className="mt-2 w-full border rounded-xl p-3"><option value="">All categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-medium">Area<select value={area} onChange={e => setArea(e.target.value)} className="mt-2 w-full border rounded-xl p-3"><option value="">All areas</option>{areas.map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-medium">Maximum price (₦)<input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any budget" className="mt-2 w-full border rounded-xl p-3" /></label>
        </div>
        {loading ? <div role="status" className="rounded-3xl bg-white p-10 text-center text-gray-500">Loading properties…</div> : error ? <div role="alert" className="rounded-3xl bg-white p-10 text-center"><p>{error}</p><button onClick={() => setReload(value => value + 1)} className="mt-4 text-primary underline">Try again</button></div> : <>
          <div className="mb-5 flex justify-between text-sm text-gray-500"><p>{filtered.length} properties found</p><button onClick={() => { setQuery(''); setCategory(''); setArea(''); setMaxPrice('') }} className="text-primary">Clear filters</button></div>
          {filtered.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map(property => <PropertyCard key={property.id} property={property} />)}</div> : <div className="rounded-3xl bg-white p-10 text-center text-gray-500">{properties.length ? 'No properties match your search. Try clearing the filters.' : 'New listings will appear here as they become available.'}</div>}
        </>}
      </section>
      <section className="mt-12 rounded-[2rem] bg-white border border-gray-200 p-7 sm:p-10 flex flex-wrap gap-6 items-center justify-between">
        <div><FiMapPin className="text-primary mb-4" size={26} /><h2 className="text-2xl font-semibold">Let’s find the right address.</h2><p className="mt-2 text-gray-500">Tell us your preferred location and budget. We’ll help you explore the options.</p></div>
        <a href="tel:+2348099513173" className="rounded-full bg-gray-900 text-white px-6 py-3">Call our agency</a>
      </section>
    </div>
  )
}
