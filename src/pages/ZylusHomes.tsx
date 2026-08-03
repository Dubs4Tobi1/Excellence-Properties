import React from 'react'
import heroImg from '../../Zylus Homes/WhatsApp Image 2026-07-27 at 22.10.13.jpeg'
import cardOne from '../../Zylus Homes/WhatsApp Image 2026-07-27 at 22.10.12.jpeg'
import cardTwo from '../../Zylus Homes/WhatsApp Image 2026-07-27 at 22.08.21.jpeg'
import cardThree from '../../Zylus Homes/WhatsApp Image 2026-07-27 at 16.42.56.jpeg'
import cardFour from '../../Zylus Homes/WhatsApp Image 2026-07-26 at 20.10.47.jpeg'

const ads = [cardOne, cardTwo, cardThree, cardFour]

export default function ZylusHomes() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Zylus Homes</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Curated Zylus Homes Advertisements</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="overflow-hidden rounded-[2rem] shadow-xl sm:aspect-[4/3]">
          <img src={heroImg} alt="Featured Zylus Home" className="h-full w-full object-cover" />
        </article>

        <div className="grid gap-4">
          {ads.map((image, index) => (
            <article key={index} className="overflow-hidden rounded-[1.75rem] shadow-lg sm:aspect-[4/5]">
              <img src={image} alt={`Zylus ad ${index + 1}`} className="h-full w-full object-cover" />
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
