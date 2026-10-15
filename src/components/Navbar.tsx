"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { Menu, X, Phone, MapPin, UtensilsCrossed } from "lucide-react";

interface NavbarProps {
  onOpenTableModal: () => void;
}

export default function Navbar({ onOpenTableModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home",       href: "#hero" },
    { label: "Experience", href: "#experience" },
    { label: "Our Food",   href: "#food-showcase" },
    { label: "The Thali",  href: "#thali-experience" },
    { label: "Our Story",  href: "#our-story" },
    { label: "Atmosphere", href: "#gallery" },
    { label: "Visit Us",   href: "#visit" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-tamarind/95 backdrop-blur-md border-b border-brass/25 py-3 shadow-2xl"
            : "bg-gradient-to-b from-tamarind/90 via-tamarind/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Brand */}
            <Link href="#hero" className="group flex flex-col items-start focus:outline-none">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-rice transition-colors duration-300 group-hover:text-buttercream">
                  Mummy&apos;s
                </span>
                <span className="font-display text-2xl sm:text-3xl font-light italic text-turmeric tracking-wide">
                  Homely Food
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-coral-red animate-pulse ml-0.5" />
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest text-brass-light/90 font-marathi">
                <span>मम्मीज होमली फूड</span>
                <span className="text-cornflower/50">•</span>
                <span className="font-sans text-[10px] uppercase text-ivory/60 tracking-wider">
                  Authentic Maharashtrian
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-semibold tracking-wide text-ivory/80 hover:text-buttercream transition-colors py-1 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cornflower transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href={`tel:${RESTAURANT_DATA.location.phoneTel}`}
                className="hidden xl:inline-flex items-center gap-2 text-xs font-semibold text-brass-light hover:text-turmeric px-3.5 py-2 rounded-full border border-brass/30 hover:border-turmeric/60 transition-all bg-mahogany/30"
              >
                <Phone className="w-3.5 h-3.5 text-cornflower" />
                <span>Call Us</span>
              </a>

              <a
                href={RESTAURANT_DATA.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ivory/90 hover:text-white px-3.5 py-2 rounded-full border border-ivory/20 hover:border-cornflower/60 transition-all bg-white/5 backdrop-blur-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-coral-red" />
                <span>Directions</span>
              </a>

              <button
                onClick={onOpenTableModal}
                className="relative overflow-hidden inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-tamarind bg-gradient-to-r from-turmeric to-[#F7C05A] hover:from-buttercream hover:to-turmeric px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 hover:shadow-turmeric/40 active:scale-95"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Find Your Table</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={onOpenTableModal}
                className="sm:hidden text-xs font-black uppercase tracking-wider text-tamarind bg-turmeric px-4 py-2 rounded-full shadow"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-ivory hover:text-turmeric focus:outline-none transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-tamarind/98 backdrop-blur-md flex flex-col justify-between pt-24 pb-8 px-6">
          <div className="flex flex-col space-y-1">
            <div className="border-b border-brass/20 pb-4 mb-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-cornflower font-black mb-1">
                Mummy&apos;s Homely Food
              </p>
              <p className="font-marathi text-base text-ivory">
                नितीन मम्मीज होमली फूड • अस्सल गावरान चव
              </p>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black font-display text-ivory hover:text-turmeric py-2 transition-colors border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-brass/20">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTableModal(); }}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-turmeric to-[#F7C05A] text-tamarind font-black tracking-widest text-xs uppercase shadow-lg"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Find Your Table</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${RESTAURANT_DATA.location.phoneTel}`}
                className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border border-cornflower/40 text-ivory text-xs font-semibold bg-cornflower/10"
              >
                <Phone className="w-3.5 h-3.5 text-cornflower" />
                <span>Call Us</span>
              </a>
              <a
                href={RESTAURANT_DATA.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border border-coral-red/40 text-ivory text-xs font-semibold bg-coral-red/10"
              >
                <MapPin className="w-3.5 h-3.5 text-coral-red" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
