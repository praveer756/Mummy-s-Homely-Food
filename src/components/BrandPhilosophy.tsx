"use client";

import React from "react";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { Sparkles } from "lucide-react";

// Each pillar gets one of the 3 accent colors
const PILLAR_ACCENTS = [
  { dot: "bg-coral-red",    border: "border-coral-red/30",    label: "text-coral-red",    badge: "bg-coral-red/10 border-coral-red/25"    },
  { dot: "bg-turmeric",     border: "border-turmeric/30",     label: "text-turmeric",     badge: "bg-turmeric/10 border-turmeric/25"     },
  { dot: "bg-cornflower",   border: "border-cornflower/30",   label: "text-cornflower",   badge: "bg-cornflower/10 border-cornflower/25"   },
];

export default function BrandPhilosophy() {
  return (
    <section className="py-24 sm:py-32 bg-[#7b6f10] relative overflow-hidden border-t border-brass/15">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-turmeric/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mahogany border border-brass/30 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-turmeric" />
            <span className="text-xs font-black tracking-[0.2em] text-buttercream uppercase">
              Our Three Pillars
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-rice leading-[1.0] tracking-tight">
            Made with love,
          </h2>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light italic text-transparent bg-clip-text bg-gradient-to-r from-coral-red via-turmeric to-buttercream leading-[1.1]">
            served with warmth.
          </h2>

          <p className="mt-6 text-base sm:text-lg text-ivory/75 font-light max-w-2xl mx-auto leading-relaxed">
            Everything we do is guided by three principles passed down through generations of home cooking in Maharashtra.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {RESTAURANT_DATA.pillars.map((pillar, idx) => {
            const accent = PILLAR_ACCENTS[idx % 3];
            return (
              <div
                key={pillar.number}
                className={`relative rounded-3xl p-8 sm:p-10 bg-mahogany border ${accent.border} hover:border-opacity-70 transition-all duration-300 hover:-translate-y-2 shadow-2xl flex flex-col group`}
              >
                {/* Number badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${accent.badge} border mb-7`}>
                  <span className={`font-mono text-lg font-black ${accent.label}`}>
                    {pillar.number}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="font-marathi text-sm text-brass-light font-semibold">
                    {pillar.marathi}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${accent.dot} group-hover:scale-150 transition-transform`} />
                </div>

                <h3 className={`font-display text-3xl sm:text-4xl font-black text-rice ${accent.label} group-hover:opacity-90 transition-colors mb-4 leading-tight`}>
                  {pillar.title}
                </h3>

                <p className="text-sm text-ivory/75 font-light leading-relaxed flex-1">
                  {pillar.description}
                </p>

                <div className="pt-5 mt-5 border-t border-brass/10 text-xs font-semibold text-brass-light/60 uppercase tracking-wider">
                  {pillar.accent}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trio color bar */}
        <div className="mt-16 max-w-sm mx-auto h-1 rounded-full overflow-hidden">
          <div className="h-full gradient-trio" />
        </div>
      </div>
    </section>
  );
}
