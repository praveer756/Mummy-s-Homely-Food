"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RESTAURANT_DATA, DishItem } from "@/data/restaurantData";
import { Flame, Sparkles, Info, X, Utensils } from "lucide-react";

interface FoodShowcaseProps {
  onOpenTableModal: () => void;
}

export default function FoodShowcase({ onOpenTableModal }: FoodShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);

  const categories = [
  {
    id: "all",
    label: "All Flavours",
    marathi: "सर्व प्रकार",
  },
  {
    id: "thali",
    label: "Traditional Thalis",
    marathi: "महाराष्ट्रीयन थाळी",
  },
  {
    id: "bhakri-sabzi",
    label: "Bhakri, Roti & Paratha",
    marathi: "भाकरी, पोळी व पराठा",
  },
  {
    id: "rice-biryani",
    label: "Rice & Biryani",
    marathi: "भात व बिर्याणी",
  },
  {
    id: "curries-seafood-soups",
    label: "Curries, Seafood & Soups",
    marathi: "रस्सा, सीफूड व सूप",
  },
  {
    id: "nashta",
    label: "Snacks & Starters",
    marathi: "नाश्ता व स्टार्टर",
  },
  {
    id: "sweets-drinks",
    label: "Sweets & Drinks",
    marathi: "गोड पदार्थ व पेये",
  },
];

  const filteredDishes =
    activeCategory === "all"
      ? RESTAURANT_DATA.menuDishes
      : RESTAURANT_DATA.menuDishes.filter((d) => d.category === activeCategory);

  return (
    <section
      id="food-showcase"
      className="py-24 sm:py-32 relative overflow-hidden texture-subtle"
      style={{ backgroundColor: "#7b6f10" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "rgba(255, 154, 60, 0.06)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: "rgba(0, 200, 150, 0.05)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
            style={{ backgroundColor: "#162240", borderColor: "rgba(255, 154, 60, 0.30)" }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#FF9A3C" }} />
            <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: "#F0EAD6" }}>
              The Homely Kitchen
            </span>
          </div>

          <h2
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight"
            style={{ color: "#F0EAD6" }}
          >
            Rooted in<br />Maharashtra.
          </h2>
          <h2
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-light italic leading-[1.1]"
            style={{
              background: "linear-gradient(135deg, #FF9A3C 0%, #F0EAD6 50%, #00C896 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Made with heart.
          </h2>

          <p
            className="mt-6 text-base sm:text-lg font-light max-w-2xl leading-relaxed"
            style={{ color: "rgba(240, 234, 214, 0.75)" }}
          >
            From comforting favourites to the bold flavours of Maharashtra — every plate is an invitation to slow down, share a meal, and feel at home.
          </p>
          <p className="mt-2 text-xs italic" style={{ color: "rgba(200, 191, 168, 0.55)" }}>
            * Menu items rotate based on seasonal produce. Freshly prepared on order.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2"
              style={
                activeCategory === cat.id
                  ? {
                      background: "linear-gradient(135deg, #FF9A3C 0%, #00C896 100%)",
                      color: "#0A1628",
                      boxShadow: "0 4px 20px rgba(255, 154, 60, 0.38)",
                    }
                  : {
                      backgroundColor: "rgba(22, 34, 64, 0.7)",
                      color: "rgba(240, 234, 214, 0.60)",
                      border: "1px solid rgba(255, 154, 60, 0.18)",
                    }
              }
            >
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-60 font-marathi font-normal">({cat.marathi})</span>
            </button>
          ))}
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col"
              style={{
                backgroundColor: "rgba(22, 34, 64, 0.55)",
                border: "1px solid rgba(255, 154, 60, 0.14)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0, 200, 150, 0.40)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255, 154, 60, 0.14)";
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/11] overflow-hidden" style={{ backgroundColor: "#060E1C" }}>
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, #0A1628 0%, transparent 55%, rgba(10,22,40,0.18) 100%)",
                  }}
                />

                {/* Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {dish.signatureDish && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider shadow-lg"
                      style={{ backgroundColor: "#FF9A3C", color: "#0A1628" }}
                    >
                      <Sparkles className="w-2.5 h-2.5" /> Signature
                    </span>
                  )}
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{
                      backgroundColor: "rgba(10, 22, 40, 0.80)",
                      backdropFilter: "blur(8px)",
                      color: "#F0EAD6",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    {dish.regionalOrigin}
                  </span>
                </div>

                {/* Spice */}
                <div
                  className="absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1"
                  style={{
                    backgroundColor: "rgba(10, 22, 40, 0.82)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {dish.spiceLevel === 0 ? (
                    <span className="text-[10px] font-semibold" style={{ color: "#00C896" }}>Mild</span>
                  ) : (
                    Array.from({ length: dish.spiceLevel }).map((_, i) => (
                      <Flame key={i} className="w-3 h-3" style={{ color: "#FF4D6D", fill: "#FF4D6D" }} />
                    ))
                  )}
                </div>

                {dish.priceNote && (
                  <div
                    className="absolute bottom-3 right-3 px-3 py-1 rounded-lg font-display text-sm font-black"
                    style={{
                      backgroundColor: "rgba(10, 22, 40, 0.95)",
                      border: "1px solid rgba(255, 154, 60, 0.40)",
                      color: "#FF9A3C",
                    }}
                  >
                    {dish.priceNote}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="font-display text-2xl sm:text-3xl font-black leading-tight transition-colors"
                    style={{ color: "#F0EAD6" }}
                  >
                    {dish.name}
                  </h3>
                  <p className="font-marathi text-sm mt-1 mb-2 font-semibold" style={{ color: "#FF9A3C" }}>
                    {dish.marathiName}
                  </p>
                  <p
                    className="text-xs sm:text-sm font-light leading-relaxed line-clamp-3"
                    style={{ color: "rgba(240, 234, 214, 0.62)" }}
                  >
                    {dish.description}
                  </p>
                </div>

                <div
                  className="pt-4 mt-4 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: "rgba(255, 154, 60, 0.12)" }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {dish.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: "rgba(0, 200, 150, 0.10)",
                          color: "#00C896",
                          border: "1px solid rgba(0, 200, 150, 0.22)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold flex items-center gap-1 text-[11px]" style={{ color: "#FF9A3C" }}>
                    <Info className="w-3.5 h-3.5" /> Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 text-center p-10 rounded-3xl max-w-4xl mx-auto relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(22,34,64,0.75) 0%, rgba(16,30,54,1) 50%, rgba(22,34,64,0.75) 100%)",
            border: "1px solid rgba(255, 154, 60, 0.22)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top, rgba(255,154,60,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <h3 className="font-display text-3xl sm:text-4xl font-black leading-tight mb-2" style={{ color: "#F0EAD6" }}>
              Hungry for an authentic<br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FF9A3C, #00C896)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                roadside feast?
              </span>
            </h3>
            <p
              className="text-xs sm:text-sm max-w-xl mx-auto mb-8 font-light"
              style={{ color: "rgba(240, 234, 214, 0.62)" }}
            >
              We prepare every bhakri and curry fresh on order. Let our kitchen know your party size in advance so your table is set the moment you arrive.
            </p>
            <button
              onClick={onOpenTableModal}
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FF9A3C 0%, #00C896 100%)",
                color: "#0A1628",
                boxShadow: "0 8px 32px rgba(255, 154, 60, 0.32)",
              }}
            >
              <Utensils className="w-4 h-4" />
              <span>Reserve Table & Pre-Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dish Modal */}
      {selectedDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10, 22, 40, 0.92)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            style={{ backgroundColor: "#0A1628", border: "1px solid rgba(255, 154, 60, 0.28)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image src={selectedDish.image} alt={selectedDish.name} fill className="object-cover" />
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-3 right-3 p-2 rounded-full border transition-colors"
                style={{
                  backgroundColor: "rgba(10, 22, 40, 0.82)",
                  color: "#F0EAD6",
                  borderColor: "rgba(255,255,255,0.10)",
                }}
              >
                <X className="w-5 h-5" />
              </button>
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(10,22,40,0.88) 0%, transparent 60%)" }}
              />
              <div className="absolute bottom-4 left-5">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#FF9A3C" }}>
                  {selectedDish.regionalOrigin}
                </span>
                {selectedDish.priceNote && (
                  <p className="font-display text-2xl font-black leading-none mt-0.5" style={{ color: "#FF9A3C" }}>
                    {selectedDish.priceNote}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-display text-3xl font-black leading-tight" style={{ color: "#F0EAD6" }}>
                {selectedDish.name}
              </h3>
              <p className="font-marathi text-sm mt-1 mb-4" style={{ color: "#FF9A3C" }}>
                {selectedDish.marathiName}
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(240, 234, 214, 0.75)" }}>
                {selectedDish.description}
              </p>

              <div className="space-y-2.5 pt-4 border-t text-xs" style={{ borderColor: "rgba(255, 154, 60, 0.14)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wider" style={{ color: "rgba(240,234,214,0.42)" }}>Spice</span>
                  <span className="font-bold" style={{ color: "#F0EAD6" }}>
                    {selectedDish.spiceLevel === 0
                      ? "Gentle & Sweet"
                      : selectedDish.spiceLevel === 1
                      ? "Mild"
                      : selectedDish.spiceLevel === 2
                      ? "Medium Heat"
                      : "Fiery Maharashtrian"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wider" style={{ color: "rgba(240,234,214,0.42)" }}>Dietary</span>
                  <span className="font-bold" style={{ color: "#00C896" }}>100% Vegetarian</span>
                </div>
              </div>

              <button
                onClick={() => { setSelectedDish(null); onOpenTableModal(); }}
                className="w-full mt-6 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #FF9A3C 0%, #00C896 100%)",
                  color: "#0A1628",
                }}
              >
                Order This For Your Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
