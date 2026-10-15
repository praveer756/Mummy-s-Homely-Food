"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RESTAURANT_DATA, ThaliHotspot } from "@/data/restaurantData";
import { Sparkles, Utensils, CheckCircle2 } from "lucide-react";

interface ThaliExperienceProps {
  onOpenTableModal: () => void;
}

export default function ThaliExperience({ onOpenTableModal }: ThaliExperienceProps) {
  const { thaliExperience } = RESTAURANT_DATA;
  const [activeHotspot, setActiveHotspot] = useState<ThaliHotspot>(thaliExperience.hotspots[0]);

  return (
    <section
      id="thali-experience"
      className="py-24 sm:py-32 relative overflow-hidden texture-paper"
      style={{
        backgroundColor: "#7b6f10",
        borderTop: "1px solid rgba(255, 154, 60, 0.16)",
        borderBottom: "1px solid rgba(255, 154, 60, 0.16)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: "rgba(255, 154, 60, 0.07)" }}
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: "rgba(0, 200, 150, 0.05)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 shadow"
            style={{
              backgroundColor: "rgba(22, 34, 64, 0.90)",
              borderColor: "rgba(255, 154, 60, 0.28)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#FF9A3C" }} />
            <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: "#F0EAD6" }}>
              The Signature Experience
            </span>
          </div>

          <h2
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight"
            style={{ color: "#F0EAD6" }}
          >
            A little bit of everything.
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
            A whole lot of love.
          </h2>

          <p className="mt-4 font-marathi text-xl font-semibold" style={{ color: "#FF9A3C" }}>
            {thaliExperience.marathiHeadline}
          </p>
          <p
            className="mt-4 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(240, 234, 214, 0.70)" }}
          >
            {thaliExperience.subtitle}
          </p>
          <p
            className="mt-5 text-[10px] font-black tracking-[0.3em] uppercase"
            style={{ color: "rgba(0, 200, 150, 0.60)" }}
          >
            ✦ Tap any pin to explore the flavours ✦
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Thali Image with Hotspots */}
          <div
            className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/12] rounded-3xl overflow-hidden shadow-2xl group"
            style={{
              border: "2px solid rgba(255, 154, 60, 0.24)",
              backgroundColor: "#0A1628",
            }}
          >
            <Image
              src="/images/food/maharashtrian-thali.jpg"
              alt="Authentic Maharashtrian Thali"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, transparent 30%, rgba(6,14,28,0.55) 100%)",
              }}
            />

            {thaliExperience.hotspots.map((spot, idx) => {
              const isSelected = activeHotspot.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot)}
                  onMouseEnter={() => setActiveHotspot(spot)}
                  style={{ top: `${spot.yPercent}%`, left: `${spot.xPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 p-2 focus:outline-none transition-transform duration-300 group/pin ${
                    isSelected ? "scale-125" : "hover:scale-115"
                  }`}
                  aria-label={`Inspect ${spot.name}`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute w-8 h-8 rounded-full transition-opacity ${
                        isSelected ? "animate-ping opacity-100" : "opacity-0 group-hover/pin:opacity-100"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(255, 154, 60, 0.32)"
                          : "rgba(255,255,255,0.18)",
                      }}
                    />
                    <span
                      className="relative flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black shadow-lg border transition-colors"
                      style={
                        isSelected
                          ? {
                              backgroundColor: "#FF9A3C",
                              color: "#0A1628",
                              borderColor: "#F0EAD6",
                              boxShadow: "0 0 16px rgba(255, 154, 60, 0.60)",
                            }
                          : {
                              backgroundColor: "rgba(10, 22, 40, 0.92)",
                              color: "#F0EAD6",
                              borderColor: "rgba(200, 191, 168, 0.45)",
                            }
                      }
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <span
                    className="hidden sm:block absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-0.5 rounded-full text-[11px] whitespace-nowrap font-black pointer-events-none transition-opacity duration-200 border"
                    style={
                      isSelected
                        ? {
                            backgroundColor: "rgba(10, 22, 40, 0.98)",
                            color: "#FF9A3C",
                            borderColor: "#FF9A3C",
                            opacity: 1,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                          }
                        : {
                            backgroundColor: "rgba(10, 22, 40, 0.85)",
                            color: "rgba(240, 234, 214, 0.85)",
                            borderColor: "rgba(255,255,255,0.12)",
                            opacity: 0,
                          }
                    }
                  >
                    {spot.name}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
              <span
                className="px-3 py-1.5 rounded-lg font-semibold"
                style={{
                  backgroundColor: "rgba(10, 22, 40, 0.78)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(240, 234, 214, 0.80)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Traditional Steel Platter
              </span>
              <span
                className="px-3 py-1.5 rounded-lg font-black"
                style={{
                  backgroundColor: "rgba(10, 22, 40, 0.92)",
                  backdropFilter: "blur(8px)",
                  color: "#FF9A3C",
                  border: "1px solid rgba(255, 154, 60, 0.32)",
                }}
              >
                8 Harmonious Elements
              </span>
            </div>
          </div>

          {/* Detail Card */}
          <div
            className="lg:col-span-5 flex flex-col rounded-3xl p-6 sm:p-8 shadow-2xl"
            style={{
              backgroundColor: "rgba(10, 22, 40, 0.97)",
              border: "1px solid rgba(255, 154, 60, 0.20)",
            }}
          >
            <div className="space-y-5">
              <div
                className="flex items-center justify-between border-b pb-4"
                style={{ borderColor: "rgba(255, 154, 60, 0.14)" }}
              >
                <span
                  className="text-[10px] uppercase tracking-[0.2em] font-black"
                  style={{ color: "#FF9A3C" }}
                >
                  {activeHotspot.role}
                </span>
                <span className="font-marathi text-sm font-semibold" style={{ color: "#00C896" }}>
                  {activeHotspot.marathiName}
                </span>
              </div>

              <div>
                <h3
                  className="font-display text-3xl sm:text-4xl font-black leading-tight"
                  style={{ color: "#F0EAD6" }}
                >
                  {activeHotspot.name}
                </h3>
                <p
                  className="mt-3 text-sm font-light leading-relaxed"
                  style={{ color: "rgba(240, 234, 214, 0.72)" }}
                >
                  {activeHotspot.description}
                </p>
              </div>

              <div className="pt-1">
                <h4
                  className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
                  style={{ color: "#00C896" }}
                >
                  Key Ingredients:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeHotspot.highlightIngredients.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(22, 34, 64, 0.85)",
                        color: "#F0EAD6",
                        border: "1px solid rgba(255, 154, 60, 0.20)",
                      }}
                    >
                      <CheckCircle2 className="w-3 h-3" style={{ color: "#FF9A3C" }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="p-4 rounded-2xl text-xs leading-relaxed"
                style={{
                  backgroundColor: "rgba(22, 34, 64, 0.45)",
                  border: "1px solid rgba(0, 200, 150, 0.15)",
                  color: "rgba(240, 234, 214, 0.70)",
                }}
              >
                <p
                  className="font-black mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider"
                  style={{ color: "#F0EAD6" }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "#FF9A3C" }} />
                  Homely Dining Ritual:
                </p>
                Break a piece of steaming Jowar Bhakri, dip into golden Pithla with a touch of spicy Thecha, and cleanse your palate with a sip of chilled Solkadhi between courses.
              </div>
            </div>

            <div
              className="mt-6 pt-5 border-t flex flex-col gap-3"
              style={{ borderColor: "rgba(255, 154, 60, 0.14)" }}
            >
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                {thaliExperience.hotspots.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspot(spot)}
                    className="py-2 px-1 rounded-xl border transition-all font-bold"
                    style={
                      activeHotspot.id === spot.id
                        ? {
                            backgroundColor: "#FF9A3C",
                            color: "#0A1628",
                            borderColor: "#FF9A3C",
                          }
                        : {
                            backgroundColor: "rgba(22, 34, 64, 0.45)",
                            color: "rgba(240, 234, 214, 0.52)",
                            borderColor: "rgba(255, 154, 60, 0.14)",
                          }
                    }
                  >
                    {spot.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <button
                onClick={onOpenTableModal}
                className="w-full mt-1 inline-flex items-center justify-center gap-2 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-98"
                style={{
                  background: "linear-gradient(135deg, #FF9A3C 0%, #00C896 100%)",
                  color: "#0A1628",
                  boxShadow: "0 8px 32px rgba(255, 154, 60, 0.30)",
                }}
              >
                <Utensils className="w-4 h-4" />
                <span>Experience The Thali In Person</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
