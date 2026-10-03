import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { mediaBucket, uploadMedia, validateMedia } from '../lib/mediaUpload'

const categories = [
  'Houses & Apartments for Sale',
  'Houses & Apartments for Rent',
  'Short Let',
  'Land & Plots for Sale',
  'Land & Plots for Rent',
  'Commercial Property',
  'Event Centers & Venues',
]

const propertyTypes = [
  'Detached Duplex',
  'Semi-Detached Duplex',
  'Terrace Duplex',
  'Bungalow',
  'Block of Flats',
  'Mini Flat',
  'Self Contain',
  'Penthouse',
  'Maisonette',
  'Townhouse',
  'Studio Apartment',
  'Mansion',
  'Villa',
  'Office Space',
  'Shop',
  'Warehouse',
  'Factory',
  'Hotel',
  'Church',
  'School',
  'Filling Station',
  'Farm Land',
  'Mixed-Use Land',
  'Residential Land',
  'Commercial Land',
]

const furnishingOptions = ['Furnished', 'Partly Furnished', 'Unfurnished']
const propertyConditions = ['New', 'Good', 'Needs Renovation', 'Old']
const amenitiesList = [
  'Balcony',
  'Chandelier',
  'Dining Area',
  'Dishwasher',
  'En Suite',
  'Hot Water',
  'Kitchen Cabinets',
  'Kitchen Shelf',
  'Microwave',
  'Pop Ceiling',
  'Prepaid Meter',
  'Refrigerator',
  'Tiled Floor',
  'TV',
  'Wardrobe',
  'Wi-Fi',
  'Air Conditioning',
  'Swimming Pool',
  'Gym',
  'Security',
  'CCTV',
  'Elevator',
  'Fence',
  'Borehole',
  'Water Supply',
  'Generator',
  'Garden',
  'Boys Quarter (BQ)',
]

const areaOptions = [
  'Lagos Island',
  'Victoria Island (VI)',
  'Ikoyi',
  'Lekki Phase 1',
  'Lekki Phase 2',
  'Ajah',
  'Sangotedo',
  'Abraham Adesanya',
  'Chevron',
  'VGC',
  'Ikate',
  'Osapa London',
  'Oniru',
  'Banana Island',
  'Ibeju-Lekki',
  'Awoyaya',
  'Lakowe',
  'Bogije',
  'Eleko',
  'Epe',
  'Ikeja GRA',
  'Alausa',
  'Oregun',
  'Maryland',
  'Ogba',
  'Ojodu',
  'Berger',
  'Omole',
  'Magodo',
  'Opebi',
  'Allen Avenue',
  'Computer Village',
  'Agidingbi',
  'Yaba',
  'Sabo',
  'Akoka',
  'Bariga',
  'Somolu',
  'Fadeyi',
  'Mushin',
  'Surulere',
  'Ojuelegba',
  'Bode Thomas',
  'Lawanson',
  'Itire',
  'Ijesha',
  'Orile',
  'Ebute Metta',
  'Adekunle',
  'Makoko',
  'Apapa',
  'Ijora',
  'Costain',
  'Oshodi',
  'Isolo',
  'Ajao Estate',
  'Mafoluku',
  'Ilasamaja',
  'Ejigbo',
  'Shasha',
  'Airport Road',
  'Agege',
  'Dopemu',
  'Abule Egba',
  'Iyana Ipaja',
  'Egbeda',
  'Idimu',
  'Ikotun',
  'Igando',
  'Ayobo',
  'Ipaja',
  'Akowonjo',
  'Alagbado',
  'Command',
  'Meiran',
  'Gowon Estate',
  'Isheri-Olofin',
  'Ketu',
  'Mile 12',
  'Kosofe',
  'Ikosi',
  'Agboyi',
  'Oworonshoki',
  'Anthony',
  'Gbagada',
  'Ojo',
  'Festac Town',
  'Amuwo Odofin',
  'Satellite Town',
  'Trade Fair',
  'Okokomaiko',
  'Ijanikin',
  'Badagry',
  'Ikorodu Town',
  'Agric',
  'Igbogbo',
  'Imota',
  'Isawo',
  'Odogunyan',
  'Ebute',
  'Owutu',
  'Ilupeju',
  'Palmgrove',
  'Anthony Village',
  'Dolphin Estate',
  'Jakande (Lekki)',
  'Agungi',
  'Jakande Estate (Isolo)',
  'Marina',
  'Obalende',
  'CMS',
  'Onikan',
]

const parseNumber = (value: string) => value.trim() ? Number(value) : null

export default function UploadProperty() {
  const [category, setCategory] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [state, setState] = useState('Lagos')
  const [area, setArea] = useState('')
  const [locality, setLocality] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [toilets, setToilets] = useState('')
  const [parking, setParking] = useState('')
  const [furnishing, setFurnishing] = useState('')
  const [condition, setCondition] = useState('')
  const [size, setSize] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [video, setVideo] = useState<FileList | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [published, setPublished] = useState(false)
  const [progress, setProgress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const navigate = useNavigate()

  const counts = Array.from({ length: 11 }, (_, index) => index.toString())

  const handleAmenitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setAmenities((current) =>
      event.target.checked ? [...current, value] : current.filter((item) => item !== value)
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting || published) return
    if (!category || !propertyType || !title.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0 || !area || !locality.trim()) {
      setMessage('Please fill in all required fields before publishing.')
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const propertyId = crypto.randomUUID()
    const uploadedPaths: string[] = []
    let recordCreated = false
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) throw new Error('Sign in with your agent account before publishing.')
      if (data.user.app_metadata?.role !== 'agent') throw new Error('Your account needs agent access before publishing. Contact the site administrator.')
      const photoFiles = Array.from(photos || [])
      if (photoFiles.length > 20) throw new Error('Choose up to 20 photos.')
      photoFiles.forEach(file => validateMedia(file, 'image'))
      if (video?.[0]) validateMedia(video[0], 'video')
      if (size && (!Number.isInteger(Number(size)) || Number(size) < 0)) throw new Error('Enter a whole number of square metres.')
      const files = [...photoFiles, ...Array.from(video || [])]
      const urls: string[] = []
      for (const [index, file] of files.entries()) {
        const path = `properties/${data.user.id}/${propertyId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
        uploadedPaths.push(path)
        urls.push(await uploadMedia(file, path, percent => setProgress(`Uploading ${index + 1} of ${files.length}: ${percent}%`)))
      }
      setProgress('Saving property details…')
      const propertyPayload = {
        id: propertyId,
        owner_id: data.user.id,
        image_url: urls[0] && photoFiles.length ? urls[0] : null,
        video_url: video?.length ? urls[photoFiles.length] : null,
        title: title.trim(),
        description,
        price: Number(price),
        category,
        property_type: propertyType,
        state,
        area,
        locality,
        amenities,
        furnishing,
        condition,
        agent_name: 'Modupe Femi-Asoro',
        bedrooms: parseNumber(bedrooms),
        bathrooms: parseNumber(bathrooms),
        toilets: parseNumber(toilets),
        parking: parseNumber(parking),
        sqm: parseNumber(size),
      }

      const { data: insertData, error: insertError } = await supabase
        .from('properties')
        .insert([propertyPayload])
        .select('id')
        .single()

      if (insertError || !insertData) {
        throw insertError || new Error('Unable to create property record.')
      }

      recordCreated = true
      if (photoFiles.length) {
        const { error } = await supabase.from('property_images').insert(
          urls.slice(0, photoFiles.length).map((url, index) => ({ property_id: propertyId, url, is_primary: index === 0 }))
        )
        if (error) throw error
      }

      setPublished(true)
      setMessage('Listing published successfully! Redirecting to My Listings...')
      setTimeout(() => navigate('/my-listings'), 1200)
    } catch (uploadError: any) {
      let cleanupFailed = false
      if (recordCreated) {
        const { data, error } = await supabase.from('properties').delete().eq('id', propertyId).select('id')
        cleanupFailed = Boolean(error) || !data?.length
      }
      if (uploadedPaths.length && !cleanupFailed) {
        const { error } = await supabase.storage.from(mediaBucket).remove(uploadedPaths)
        cleanupFailed = Boolean(error)
      }
      setMessage(`${uploadError?.message || 'Unable to publish listing.'}${cleanupFailed ? ` Cleanup needs attention; reference: ${propertyId}.` : ' Please try again.'}`)
    } finally {
      setProgress('')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <p className="text-sm uppercase tracking-widest text-primary mb-2">Agent workspace</p>
      <h2 className="text-3xl font-semibold mb-3">Create your property listing</h2>
      <p className="mb-6 text-gray-600">Add the details, photos and a video tour. Keep this page open while your files upload.</p>
      <form className="mb-8 rounded-3xl border bg-white p-6 flex flex-wrap gap-3" onSubmit={async e => {
        e.preventDefault(); setSigningIn(true)
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          setMessage(error ? error.message : 'Signed in. You can now publish your listing.')
          if (!error) setPassword('')
        } catch { setMessage('Unable to sign in. Check your connection and try again.') }
        finally { setSigningIn(false) }
      }}>
        <input aria-label="Agent email" type="email" required autoComplete="username" placeholder="Agent email" value={email} onChange={e => setEmail(e.target.value)} className="border rounded-xl p-3" />
        <input aria-label="Password" type="password" required autoComplete="current-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded-xl p-3" />
        <button disabled={signingIn || isSubmitting} className="rounded-xl bg-gray-900 text-white px-5 py-3">{signingIn ? 'Signing in…' : 'Agent sign in'}</button>
      </form>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting || published} className="space-y-8">
        {message && (
          <div className="rounded-3xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-700">
            {message}
          </div>
        )}

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">1. Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select category</option>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">2. Property Type</h3>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select property type</option>
            {propertyTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">3. Title</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="4 Bedroom Detached Duplex with BQ in Lekki Phase 1"
            className="w-full rounded-xl border border-gray-300 p-3"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">4. Price</h3>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">5. Location</h3>
            <div className="space-y-4">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="Lagos">Lagos</option>
              </select>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Select area / LGA</option>
                {areaOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <input
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="Locality or estate"
                className="w-full rounded-xl border border-gray-300 p-3"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">6. Property Details</h3>
            <div className="space-y-4">
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Bedrooms</option>
                {counts.map((count) => (
                  <option key={`bed-${count}`} value={count}>{count}</option>
                ))}
              </select>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Bathrooms</option>
                {counts.map((count) => (
                  <option key={`bath-${count}`} value={count}>{count}</option>
                ))}
              </select>
              <select
                value={toilets}
                onChange={(e) => setToilets(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Toilets</option>
                {counts.map((count) => (
                  <option key={`toilet-${count}`} value={count}>{count}</option>
                ))}
              </select>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Parking spaces</option>
                {counts.map((count) => (
                  <option key={`park-${count}`} value={count}>{count}</option>
                ))}
              </select>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Furnishing status</option>
                {furnishingOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
              >
                <option value="">Property condition</option>
                {propertyConditions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Square meters"
                className="w-full rounded-xl border border-gray-300 p-3"
              />
            </div>
          </div>
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">7. Facilities / Amenities</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenitiesList.map((option) => (
                <label key={option} className="flex items-center gap-2 rounded-2xl border border-gray-300 p-3 text-sm">
                  <input
                    type="checkbox"
                    value={option}
                    checked={amenities.includes(option)}
                    onChange={handleAmenitiesChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">8. Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Property features, location advantages, nearby landmarks, payment terms, service charge, title documents"
            className="min-h-[220px] w-full rounded-3xl border border-gray-300 p-4"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">9. Photos</h3>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setPhotos(e.target.files)}
              className="w-full rounded-3xl border border-gray-300 p-3 text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">Upload multiple high-quality images. No watermarks or contact info on images.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">10. Videos (if available)</h3>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(e) => setVideo(e.target.files)}
              className="w-full rounded-3xl border border-gray-300 p-3 text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">MP4 or WebM, up to 50 MB. Large files upload in chunks with automatic retries.</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={isSubmitting || published} className="rounded-3xl bg-primary px-6 py-3 text-white disabled:opacity-60">
            {isSubmitting ? 'Publishing…' : 'Publish Listing'}
          </button>
          <p role="status" aria-live="polite" className="self-center text-sm text-gray-600">{progress}</p>
        </div>
        </fieldset>
      </form>
    </div>
  )
}
