import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

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

const bucketName = 'property-images'

const parseNumber = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? Number(trimmed) : null
}

const sanitizeFileName = (name: string) => {
  return name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_.]/g, '-')
    .replace(/-+/g, '-')
}

const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
  return data?.publicUrl || ''
}

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
  const navigate = useNavigate()

  const counts = Array.from({ length: 11 }, (_, index) => index.toString())

  const handleAmenitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setAmenities((current) =>
      event.target.checked ? [...current, value] : current.filter((item) => item !== value)
    )
  }

  const uploadFile = async (file: File, propertyId: string) => {
    const safeName = sanitizeFileName(file.name)
    const path = `properties/${propertyId}/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      throw uploadError
    }

    return getPublicUrl(path)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!category || !propertyType || !title || !price || !area || !locality) {
      setMessage('Please fill in all required fields before publishing.')
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const propertyPayload = {
        title,
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

      const propertyId = insertData.id
      let primaryImageUrl = ''
      let uploadedVideoUrl = ''

      if (photos?.length) {
        const files = Array.from(photos)
        const photoUrls = await Promise.all(files.map((file) => uploadFile(file, propertyId)))

        primaryImageUrl = photoUrls[0] || ''

        await supabase.from('property_images').insert(
          photoUrls.map((url, index) => ({
            property_id: propertyId,
            url,
            is_primary: index === 0,
          }))
        )
      }

      if (video?.length) {
        uploadedVideoUrl = await uploadFile(video[0], propertyId)
      }

      if (primaryImageUrl || uploadedVideoUrl) {
        const updatePayload: any = {}
        if (primaryImageUrl) updatePayload.image_url = primaryImageUrl
        if (uploadedVideoUrl) updatePayload.video_url = uploadedVideoUrl

        await supabase.from('properties').update(updatePayload).eq('id', propertyId)
      }

      setMessage('Listing published successfully! Redirecting to My Listings...')
      setTimeout(() => navigate('/my-listings'), 1200)
    } catch (uploadError: any) {
      setMessage(uploadError?.message || 'Unable to publish listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-semibold mb-6">Upload Property</h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
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
              accept="image/*"
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
              accept="video/*"
              onChange={(e) => setVideo(e.target.files)}
              className="w-full rounded-3xl border border-gray-300 p-3 text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">Upload or attach a video tour if available.</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={isSubmitting} className="rounded-3xl bg-primary px-6 py-3 text-white disabled:opacity-60">
            {isSubmitting ? 'Publishing…' : 'Publish Listing'}
          </button>
          <button type="button" className="rounded-3xl border border-gray-300 px-6 py-3">Save Draft</button>
        </div>
      </form>
    </div>
  )
}
