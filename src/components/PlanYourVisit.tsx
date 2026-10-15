"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { MapPin, Phone, Clock, Navigation, UtensilsCrossed, CheckCircle } from "lucide-react";

export default function PlanYourVisit() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", partySize: "4",
    seatingPreference: "charpai", timeSlot: "dinner",
    date: "", specialRequest: "",
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setFormSubmitted(true); };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#0F1B14] border border-banana-leaf/35 text-rice text-sm focus:outline-none focus:border-cornflower transition-colors placeholder:text-ivory/25 font-medium";

  return (
    <section id="visit" className="py-24 sm:py-32 bg-[#1C2C21] relative overflow-hidden texture-subtle">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-banana-leaf/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cornflower/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16271D] border border-cornflower/30 mb-5">
            <MapPin className="w-3.5 h-3.5 text-cornflower" />
            <span className="text-xs font-black tracking-[0.2em] text-buttercream uppercase">
              Come Visit Us
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-rice leading-[1.0] tracking-tight">
            We'll save
          </h2>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cornflower to-buttercream leading-[1.1]">
            you a seat.
          </h2>

          <p className="mt-6 text-base sm:text-lg text-ivory/80 font-light max-w-2xl leading-relaxed">
            Whether you are on a weekend road trip, driving between cities, or craving hot Jowar Bhakris and Pithla — our open-air decks are ready to welcome you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Info Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#16271D] border border-banana-leaf/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

              {/* Exterior image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-md">
                <Image src="/images/restaurant/hero-exterior-night.jpg" alt="Mummy's Homely Food entrance" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-black text-turmeric">Recognize us from the road</span>
                  <span className="bg-coral-red/90 px-2.5 py-1 rounded-lg text-[10px] font-black text-white">
                    Red Glowing Sign
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cornflower/15 border border-cornflower/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-cornflower" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-rice">{RESTAURANT_DATA.name}</h3>
                    <p className="font-marathi text-xs text-buttercream mt-0.5">{RESTAURANT_DATA.marathiName}</p>
                    <p className="text-xs text-ivory/70 mt-1.5 leading-relaxed">
                      {RESTAURANT_DATA.location.addressLine1}<br />
                      {RESTAURANT_DATA.location.addressLine2}
                    </p>
                    <p className="text-[11px] text-turmeric/80 mt-1 italic">{RESTAURANT_DATA.location.landmark}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-9 h-9 rounded-xl bg-turmeric/10 border border-turmeric/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-turmeric" />
                  </div>
                  <div className="text-xs text-ivory/80">
                    <p className="font-black text-white mb-0.5">Opening Hours</p>
                    <p className="text-ivory/60">Lunch: {RESTAURANT_DATA.hours.lunch} | Dinner: {RESTAURANT_DATA.hours.dinner}</p>
                    <p className="text-emerald-400 font-semibold mt-0.5">✓ {RESTAURANT_DATA.hours.days}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${RESTAURANT_DATA.location.phoneTel}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-turmeric to-buttercream text-tamarind font-black text-xs uppercase tracking-wider shadow transition-all hover:opacity-90"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </a>
                <a
                  href={RESTAURANT_DATA.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cornflower/15 hover:bg-cornflower/25 text-cornflower font-black text-xs uppercase tracking-wider border border-cornflower/30 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Maps</span>
                </a>
              </div>
            </div>

            {/* Travel tip */}
            <div className="p-5 rounded-2xl bg-[#16271D]/70 border border-cornflower/15 text-xs text-ivory/75 leading-relaxed">
              <p className="font-black text-cornflower mb-1.5 text-[11px] uppercase tracking-wider">
                🚗 Highway Traveller Friendly
              </p>
              Spacious open-air parking for cars and bikes. Fresh washrooms and a peaceful outdoor breeze after a tiring drive.
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7 bg-[#16271D] border border-banana-leaf/25 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="border-b border-banana-leaf/20 pb-6 mb-7">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cornflower">
                Table & Charpai Seating
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-black text-rice mt-2 leading-tight">
                Reserve Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-turmeric to-buttercream">
                  Homely Feast
                </span>
              </h3>
              <p className="text-xs text-ivory/60 mt-2 font-light">
                Let us know you're coming so our kitchen has the tawa sizzling hot and ready.
              </p>
            </div>

            {formSubmitted ? (
              <div className="py-14 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                    We look forward to<br />feeding you!
                  </h4>
                  <p className="text-sm text-ivory/70 max-w-md mx-auto mt-3 font-light leading-relaxed">
                    Thank you, <strong className="text-turmeric font-black">{formData.name || "Guest"}</strong>. Your seating inquiry for {formData.partySize} guests has been recorded.
                  </p>
                </div>
                <button onClick={() => setFormSubmitted(false)} className="text-xs text-cornflower underline hover:text-white font-semibold">
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-ivory/80 mb-1.5 uppercase tracking-wider">Your Full Name</label>
                    <input type="text" required placeholder="e.g. Anand Deshmukh" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-ivory/80 mb-1.5 uppercase tracking-wider">WhatsApp / Phone</label>
                    <input type="tel" required placeholder="+91 98XXX XXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-ivory/80 mb-1.5 uppercase tracking-wider">Party Size</label>
                    <select value={formData.partySize} onChange={(e) => setFormData({ ...formData, partySize: e.target.value })} className={inputClass}>
                      <option value="1-2">1–2 Diners</option>
                      <option value="3-4">3–4 Diners</option>
                      <option value="5-8">5–8 (Family)</option>
                      <option value="9+">9+ (Large Group)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-ivory/80 mb-1.5 uppercase tracking-wider">Seating</label>
                    <select value={formData.seatingPreference} onChange={(e) => setFormData({ ...formData, seatingPreference: e.target.value })} className={inputClass}>
                      <option value="charpai">Traditional Charpai</option>
                      <option value="upper-deck">Upper Deck</option>
                      <option value="courtyard">Gravel Patio</option>
                      <option value="standard">Standard Table</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-ivory/80 mb-1.5 uppercase tracking-wider">Time</label>
                    <select value={formData.timeSlot} onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })} className={inputClass}>
                      <option value="lunch">Lunch (12–3:30 PM)</option>
                      <option value="sunset">Evening Tea (4:30–6:30)</option>
                      <option value="dinner">Dinner (7:30–11 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-ivory/80 mb-1.5 uppercase tracking-wider">Special Requests</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 4 Maharashtrian Thalis, extra Pithla Bhakri, fresh Solkadhi"
                    value={formData.specialRequest}
                    onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cornflower via-turmeric to-buttercream hover:opacity-95 text-tamarind font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 mt-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Reserve Table & Pre-Alert Kitchen</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
