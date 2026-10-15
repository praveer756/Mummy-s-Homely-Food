"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Flame, UtensilsCrossed } from "lucide-react";

interface PreloaderProps {
  progress: number;
  isReady: boolean;
  onEnter?: () => void;
}

export default function Preloader({ progress, isReady, onEnter }: PreloaderProps) {
  const [hidden, setHidden] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const target = isReady ? 100 : Math.min(progress, 95);
    const interval = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev < target) return Math.min(prev + Math.max(1, Math.ceil((target - prev) / 6)), target);
        return prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [progress, isReady]);

  useEffect(() => {
    if (isReady && displayPercent >= 100) {
      const t = setTimeout(() => { setHidden(true); onEnter?.(); }, 700);
      return () => clearTimeout(t);
    }
  }, [isReady, displayPercent, onEnter]);

  if (hidden) return null;

  const getMessage = () => {
    if (displayPercent < 25) return "Lighting the sigdi & heating the clay tawa...";
    if (displayPercent < 55) return "Building the open-air Maharashtrian eatery...";
    if (displayPercent < 80) return "Patting fresh Jowar Bhakris & blending goda masala...";
    if (displayPercent < 100) return "Hanging warm lanterns & setting the charpai cots...";
    return "Your table is ready. Welcome to Mummy's Homely Food!";
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0E0705] flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-1000 ease-in-out ${
        isReady && displayPercent >= 100
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
    >
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-turmeric/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-coral-red/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cornflower/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">

        {/* Flame emblem */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-coral-red/20 via-turmeric/15 to-cornflower/10 flex items-center justify-center border border-brass/30 shadow-[0_0_60px_rgba(230,167,46,0.25)]">
            <Flame className="w-12 h-12 text-turmeric animate-bounce" style={{ animationDuration: "700ms" }} />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-coral-red animate-ping" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-cornflower animate-pulse" />
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-marathi text-sm tracking-widest text-buttercream mb-2">
            ॥ अतिथी देवो भव ॥
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
            Mummy&apos;s
          </h1>
          <h2 className="font-display text-3xl sm:text-4xl font-light italic text-turmeric leading-none mt-1">
            Homely Food
          </h2>
          <p className="font-marathi text-sm text-ivory/80 mt-3">
            मम्मीज होमली फूड • अस्सल गावरान चव
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-mahogany/60 rounded-full h-2.5 border border-brass/20 p-0.5 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${displayPercent}%`,
              background: "linear-gradient(90deg, #E94B4B 0%, #E6A72E 50%, #FFE7A3 100%)",
              boxShadow: "0 0 12px rgba(230,167,46,0.7)",
            }}
          />
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-brass-light/80 mb-4 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cornflower animate-spin" />
            <span className="font-semibold uppercase tracking-wider">Loading Experience</span>
          </span>
          <span className="font-black text-white text-base">{displayPercent}%</span>
        </div>

        {/* Status message */}
        <p className="text-xs sm:text-sm text-ivory/70 font-light italic min-h-[2.5rem] flex items-center justify-center leading-relaxed text-center">
          {getMessage()}
        </p>

        {/* Three color dots */}
        <div className="flex items-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-coral-red animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-turmeric animate-pulse" style={{ animationDelay: "200ms" }} />
          <span className="w-2 h-2 rounded-full bg-cornflower animate-pulse" style={{ animationDelay: "400ms" }} />
        </div>

        {/* Enter button */}
        {isReady && displayPercent >= 98 && (
          <button
            onClick={() => { setHidden(true); onEnter?.(); }}
            className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-turmeric to-buttercream text-tamarind font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Enter Restaurant</span>
          </button>
        )}
      </div>
    </div>
  );
}
