"use client";

import React from "react";
import Link from "next/link";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { ArrowUp, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0E0705] text-rice border-t border-brass/20 relative overflow-hidden texture-paper pt-16 sm:pt-20 pb-12">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-turmeric/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-coral-red/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-cornflower/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Banner */}
        <div className="text-center pb-14 border-b border-brass/15">
          <p className="font-marathi text-base sm:text-lg text-turmeric font-semibold tracking-wider mb-3">
            ॥ अतिथी देवो भव ॥
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-rice tracking-tight leading-[1.0]">
            Your home for
          </h2>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light italic text-transparent bg-clip-text bg-gradient-to-r from-coral-red via-turmeric to-buttercream leading-[1.1]">
            a good meal.
          </h2>
          <p className="font-serif italic text-xl sm:text-2xl text-brass-light mt-3">
            "Come hungry. Leave happy."
          </p>

          {/* Color accent bar */}
          <div className="mt-8 max-w-xs mx-auto h-1 rounded-full overflow-hidden">
            <div className="h-full gradient-trio" />
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-brass/10 text-xs">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black text-rice leading-none">Mummy's</span>
              <span className="font-display text-2xl font-light italic text-turmeric leading-none mt-0.5">Homely Food</span>
              <span className="font-marathi text-xs text-brass-light/80 mt-2">
                मम्मीज होमली फूड • अस्सल महाराष्ट्रीयन
              </span>
            </div>
            <p className="text-ivory/60 leading-relaxed font-light">
              An authentic open-air Maharashtrian eatery where hospitality is generous, the bhakris are hot from the tawa, and everyone is welcomed like family.
            </p>
            {/* 3 color dots */}
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-red" />
              <span className="w-2.5 h-2.5 rounded-full bg-turmeric" />
              <span className="w-2.5 h-2.5 rounded-full bg-cornflower" />
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-[0.2em] text-buttercream text-[11px]">Explore</h4>
            <ul className="space-y-2 text-ivory/65">
              {[
                { href: "#hero",              label: "Home & Exterior" },
                { href: "#experience",        label: "The Entrance Journey" },
                { href: "#food-showcase",     label: "Menu & Dishes" },
                { href: "#thali-experience",  label: "The Signature Thali" },
                { href: "#our-story",         label: "Our Homely Story" },
                { href: "#gallery",           label: "Restaurant Atmosphere" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-buttercream transition-colors font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Timings */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-[0.2em] text-buttercream text-[11px]">Kitchen Timings</h4>
            <div className="space-y-2 text-ivory/65">
              <p><strong className="text-white font-black">Lunch:</strong> 11:30 AM – 4:00 PM</p>
              <p><strong className="text-white font-black">Dinner:</strong> 7:00 PM – 11:30 PM</p>
              <p className="text-emerald-400 font-black pt-1">Open All 7 Days</p>
              <p className="text-[11px] text-ivory/45 italic">
                * Evening Charpai seating fills early on weekends.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-[0.2em] text-buttercream text-[11px]">Location & Contact</h4>
            <div className="space-y-3 text-ivory/65">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-coral-red flex-shrink-0 mt-0.5" />
                <span>{RESTAURANT_DATA.location.addressLine1}, {RESTAURANT_DATA.location.addressLine2}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-turmeric flex-shrink-0" />
                <a href={`tel:${RESTAURANT_DATA.location.phoneTel}`} className="hover:text-turmeric transition-colors font-medium">
                  {RESTAURANT_DATA.location.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cornflower flex-shrink-0" />
                <span>{RESTAURANT_DATA.location.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/40">
          <p>
            © {new Date().getFullYear()} Mummy's Homely Food. Crafted with respect for Maharashtra's roadside culinary heritage.
          </p>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mahogany/80 border border-brass/25 hover:border-turmeric text-ivory/70 hover:text-turmeric transition-all font-semibold"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-turmeric" />
          </button>
        </div>
      </div>
    </footer>
  );
}
