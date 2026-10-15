"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, Utensils, Volume2, VolumeX, Eye, Flame, UtensilsCrossed } from "lucide-react";

interface CinematicHeroProps {
  onExploreMenu: () => void;
  onOpenTableModal: () => void;
}

export default function CinematicHero({
  onExploreMenu,
  onOpenTableModal,
}: CinematicHeroProps) {
  // Journey state: 0 = Outside by Road, 1 = Approaching Entrance, 2 = Inside Dining on Charpai
  const [journeyStage, setJourneyStage] = useState<0 | 1 | 2>(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<AudioNode[]>([]);

  // Smooth scroll sync for camera push
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      if (scrollY < heroHeight * 0.3) {
        setJourneyStage(0);
      } else if (scrollY < heroHeight * 0.75) {
        setJourneyStage(1);
      } else if (scrollY < heroHeight * 1.3) {
        setJourneyStage(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Web Audio API ambient cricket & warm evening breeze generator
  const toggleAmbientSound = () => {
    if (isAudioActive) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Gentle cricket chirping oscillator
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(4600, ctx.currentTime);

        // Modulator for rhythmic gentle chirps
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        mod.frequency.setValueAtTime(3.5, ctx.currentTime);
        modGain.gain.setValueAtTime(200, ctx.currentTime);
        mod.connect(osc.frequency);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        mod.start();
        oscillatorNodesRef.current = [osc, mod, gain];
        setIsAudioActive(true);
      } catch (e) {
        console.warn("Audio Context init error", e);
      }
    }
  };

  const handleStepInside = () => {
    const targetElement = document.getElementById("experience");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    setJourneyStage(1);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden bg-[#291812] flex flex-col justify-between"
    >
      {/* Background Layer A: The Real Restaurant Exterior at Dusk */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-out origin-center ${
          journeyStage === 0
            ? "scale-100 translate-y-0 opacity-100"
            : journeyStage === 1
            ? "scale-115 -translate-y-4 opacity-85"
            : "scale-125 -translate-y-8 opacity-25 filter blur-xs"
        }`}
      >
        <Image
          src="/images/restaurant/hero-exterior-night.jpg"
          alt="Mummy’s Homely Food illuminated restaurant exterior at night"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] md:object-[center_38%]"
        />

        {/* Cinematic Vignette & Color Grading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#291812] via-[#291812]/50 to-[#291812]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#291812]/40 to-[#291812]/80" />

        {/* Ambient Warm Light Bloom over the illuminated red neon sign */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/25 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-[22%] left-[45%] w-48 h-20 bg-red-600/20 blur-2xl pointer-events-none rounded-full" />
      </div>

      {/* Floating Ambient Sparks / Warm Fireflies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 rounded-full bg-turmeric/80 blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-amber-300/60 blur-[0.5px] animate-ping duration-1000" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-400/50 blur-[0.5px] animate-pulse duration-700" />
      </div>

      {/* Ambient Sound & Experience Mode Toggles */}
      <div className="relative z-20 pt-24 sm:pt-28 px-4 sm:px-8 max-w-7xl mx-auto w-full flex justify-between items-center text-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-brass/30 text-rice">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-rice/90">
            Dhaba Open • Roadside Dining
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTableModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-turmeric/20 hover:bg-turmeric/30 text-turmeric border border-turmeric/40 font-medium text-xs transition-colors"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Table Inquiry</span>
          </button>

          <button
            onClick={toggleAmbientSound}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#291812]/80 hover:bg-[#48251B] backdrop-blur-md border border-[#B99A61]/40 text-ivory text-xs transition-all hover:border-turmeric"
            title="Toggle evening ambient sounds"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-turmeric animate-pulse" />
                <span>Evening Breeze: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-ivory/60" />
                <span>Evening Sound</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Cinematic Hero Content (Scene A) */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center flex flex-col items-center">
        {/* Refined Brand Subtitle */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tamarind/70 border border-brass/40 backdrop-blur-md mb-4 sm:mb-6 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-turmeric" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#DFCA9B] uppercase">
            MAHARASHTRIAN FOOD • MADE WITH LOVE
          </span>
        </div>

        {/* Large Headline in Display Serif */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-rice leading-[1.08] max-w-4xl drop-shadow-lg">
          Some places <br />
          <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-turmeric via-[#F7C05A] to-terracotta glow-warm-sign">
            feel like home.
          </span>
        </h1>

        {/* Marathi Cultural Touchpoint */}
        <p className="mt-3 font-marathi text-base sm:text-xl text-[#F7EBD5]/90 tracking-wide">
          “आईच्या हातची माया, गावरान मातीची चव.”
        </p>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-ivory/90 font-light max-w-2xl leading-relaxed">
          Authentic Maharashtrian flavours. The unpretentious warmth of an open-air roadside meal, served fresh under the evening stars.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleStepInside}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold uppercase tracking-wider text-tamarind bg-gradient-to-r from-turmeric to-[#F7C05A] hover:from-[#F7C05A] hover:to-turmeric shadow-xl hover:shadow-turmeric/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Eye className="w-5 h-5 text-tamarind" />
            <span>Step Inside</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("experience");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-semibold tracking-wide text-rice bg-[#190E09]/80 hover:bg-[#190E09] border border-brass/50 hover:border-turmeric shadow-lg transition-all duration-300 backdrop-blur-md"
          >
            <span className="text-turmeric">✦</span>
            <span>3D Blender Flight</span>
          </button>

          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-base font-medium tracking-wide text-ivory hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-ivory/30 hover:border-ivory/60 transition-all duration-300"
          >
            <Utensils className="w-4 h-4 text-turmeric" />
            <span>Explore Menu</span>
          </button>
        </div>

        {/* Quick Highlights Pills */}
        <div className="mt-10 sm:mt-12 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm text-ivory/80">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#48251B]/60 border border-brass/20">
            <Flame className="w-3.5 h-3.5 text-turmeric" /> Hot Jowar Bhakris
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#48251B]/60 border border-brass/20">
            ✨ Charpai (खाट) Seating
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#48251B]/60 border border-brass/20">
            🌿 Traditional Maharashtrian Thali
          </span>
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <div className="relative z-20 pb-8 flex flex-col items-center justify-center text-center">
        <button
          onClick={handleStepInside}
          className="group inline-flex flex-col items-center text-ivory/70 hover:text-turmeric transition-colors focus:outline-none"
          aria-label="Scroll to restaurant entrance experience"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#DFCA9B] mb-2 group-hover:text-turmeric transition-colors">
            YOUR TABLE IS WAITING
          </span>
          <div className="w-8 h-8 rounded-full border border-brass/40 group-hover:border-turmeric flex items-center justify-center transition-all animate-bounce">
            <ArrowDown className="w-4 h-4 text-turmeric" />
          </div>
        </button>
      </div>
    </section>
  );
}
