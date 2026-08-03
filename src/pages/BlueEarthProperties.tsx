import React from 'react'
import heroImg from '../../Blue Earth Properties/WhatsApp Image 2026-07-27 at 13.35.57.jpeg'
import cardOne from '../../Blue Earth Properties/WhatsApp Image 2026-07-27 at 13.35.57 (1).jpeg'

const ads = [cardOne]

export default function BlueEarthProperties() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Blue Earth Properties</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Blue Earth Advertisements</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="overflow-hidden rounded-[2rem] shadow-xl sm:aspect-[4/3]">
          <img src={heroImg} alt="Featured Blue Earth Property" className="h-full w-full object-cover" />
        </article>

        <div className="grid gap-4">
          {ads.map((image, index) => (
            <article key={index} className="overflow-hidden rounded-[1.75rem] shadow-lg sm:aspect-[4/5]">
              <img src={image} alt={`Blue Earth ad ${index + 1}`} className="h-full w-full object-cover" />
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
