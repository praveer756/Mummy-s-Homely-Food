"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RESTAURANT_DATA, GalleryPhoto } from "@/data/restaurantData";
import { Maximize2, X, Camera } from "lucide-react";

export default function RestaurantGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = [
    { id: "all",      label: "All Spaces" },
    { id: "exterior", label: "Night Exterior" },
    { id: "dining",   label: "Charpai Seating" },
    { id: "details",  label: "Rustic Details" },
    { id: "food",     label: "The Food" },
  ];

  const filteredPhotos =
    activeFilter === "all"
      ? RESTAURANT_DATA.gallery
      : RESTAURANT_DATA.gallery.filter((p) => p.category === activeFilter);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-tamarind relative overflow-hidden texture-paper">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cornflower/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mahogany border border-cornflower/30 mb-5">
            <Camera className="w-3.5 h-3.5 text-cornflower" />
            <span className="text-xs font-black tracking-[0.2em] text-buttercream uppercase">
              The Real Spaces
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-rice leading-[1.0] tracking-tight">
            The Restaurant
          </h2>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cornflower to-buttercream leading-[1.1]">
            Experience.
          </h2>

          <p className="mt-4 font-serif italic text-xl sm:text-2xl text-turmeric font-semibold">
            "{RESTAURANT_DATA.ambianceCaption}"
          </p>
          <p className="mt-3 text-sm text-ivory/70 font-light max-w-2xl mx-auto leading-relaxed">
            An authentic roadside eatery under the night sky, illuminated by warm lights, friendly smiles, and the scent of freshly rolled bhakris.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  activeFilter === f.id
                    ? "bg-gradient-to-r from-cornflower to-buttercream text-tamarind shadow-lg"
                    : "bg-mahogany/50 hover:bg-mahogany text-ivory/70 border border-brass/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className={`group cursor-pointer rounded-3xl overflow-hidden bg-mahogany/30 border border-brass/20 hover:border-cornflower/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl relative ${
                photo.highlight && index === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3] sm:aspect-[16/11]"
              }`}
            >
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tamarind/90 via-transparent to-black/20 transition-all duration-300" />

              {/* Expand icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-ivory/70 group-hover:text-cornflower group-hover:bg-black/90 transition-all border border-white/10">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-tamarind/92 backdrop-blur-md border border-brass/25">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-lg sm:text-xl font-black text-rice group-hover:text-buttercream transition-colors">
                    {photo.title}
                  </h3>
                  <span className="font-marathi text-xs text-turmeric font-semibold">
                    {photo.marathiTitle}
                  </span>
                </div>
                <p className="text-xs text-ivory/70 font-light line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-tamarind border border-brass/30 rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-black">
              <Image src={selectedPhoto.image} alt={selectedPhoto.title} fill className="object-contain" />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-ivory border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl sm:text-3xl font-black text-rice">{selectedPhoto.title}</h3>
                <span className="font-marathi text-sm text-turmeric font-semibold">{selectedPhoto.marathiTitle}</span>
              </div>
              <p className="text-sm text-ivory/75 leading-relaxed">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
