import React, { useState } from 'react'

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

const furnishingOptions = ['Furnished', 'Partly Furnished', 'Unfurnished']
const conditionOptions = ['New', 'Good', 'Needs Renovation', 'Old']
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

const countOptions = Array.from({ length: 12 }, (_, index) => index.toString())

export default function Home() {
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [category, setCategory] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [locationState, setLocationState] = useState('Lagos')
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

  const handleAmenitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setAmenities((current) =>
      event.target.checked ? [...current, value] : current.filter((item) => item !== value)
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <section className="relative rounded-lg overflow-hidden mb-8">
        <div className="h-96 bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
          <div className="text-center px-6">
            <h1 className="text-4xl font-bold">Excellence Property Agencies</h1>
            <p className="mt-3 text-lg">Buy, sell and rent premium properties across Nigeria</p>
            <div className="mt-4 flex items-center justify-center gap-3 relative z-40">
              <button
                type="button"
                onClick={() => setShowContactMenu((value) => !value)}
                className="bg-white text-primary px-4 py-2 rounded-full font-semibold shadow-md hover:bg-gray-100"
              >
                Contact options
              </button>
              {showContactMenu && (
                <div className="absolute top-full right-0 mt-2 w-52 rounded-xl bg-white text-gray-900 shadow-lg ring-1 ring-black/10 z-50">
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
            <div className="mt-6 flex justify-center">
              <div className="flex items-center w-2/3 md:w-1/2 rounded-full overflow-hidden border border-white/30 bg-white/10 backdrop-blur">
                <input
                  className="w-full px-4 py-3 bg-transparent text-white placeholder:text-white/80 outline-none"
                  placeholder="Search by location, keyword or ref"
                />
                <button
                  type="button"
                  onClick={() => setShowFilterMenu(true)}
                  className="bg-white/20 px-4 py-3 text-white font-semibold hover:bg-white/30"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showFilterMenu && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 p-4">
          <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Filter properties</h2>
                <p className="text-sm text-gray-600">Choose the filters you want and hit apply.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterMenu(false)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select category</option>
                    {categories.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Title / Headline</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="4 Bedroom Detached Duplex with BQ in Lekki Phase 1"
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-base font-semibold mb-4">Location</h3>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <select
                      value={locationState}
                      onChange={(e) => setLocationState(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 p-3"
                    >
                      <option value="Lagos">Lagos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area / LGA</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 p-3"
                    >
                      <option value="">Select area</option>
                      {areaOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Locality / Estate</label>
                    <input
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Locality or estate"
                      className="w-full rounded-2xl border border-gray-300 p-3"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select bedrooms</option>
                    {countOptions.map((count) => (
                      <option key={`bed-${count}`} value={count}>{count}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select bathrooms</option>
                    {countOptions.map((count) => (
                      <option key={`bath-${count}`} value={count}>{count}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Toilets</label>
                  <select
                    value={toilets}
                    onChange={(e) => setToilets(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select toilets</option>
                    {countOptions.map((count) => (
                      <option key={`toilet-${count}`} value={count}>{count}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Parking spaces</label>
                  <select
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select parking</option>
                    {countOptions.map((count) => (
                      <option key={`park-${count}`} value={count}>{count}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Furnishing status</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select furnishing</option>
                    {furnishingOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-3"
                  >
                    <option value="">Select condition</option>
                    {conditionOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Square meters</label>
                <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Enter size"
                  className="w-full rounded-2xl border border-gray-300 p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
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

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Property features, location advantages, nearby landmarks, payment terms, service charge, title documents"
                  className="h-40 w-full rounded-3xl border border-gray-300 p-4"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowFilterMenu(false)}
                className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={() => setShowFilterMenu(false)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Properties</h2>
        <div className="text-sm text-gray-500">No featured properties available.</div>
      </section>
    </div>
  )
}
