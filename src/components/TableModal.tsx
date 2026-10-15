"use client";

import React, { useState } from "react";
import { X, UtensilsCrossed, CheckCircle, Sparkles, Phone } from "lucide-react";
import { RESTAURANT_DATA } from "@/data/restaurantData";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TableModal({ isOpen, onClose }: TableModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    partySize: "4",
    seatingPreference: "charpai",
    timeSlot: "dinner",
    date: "",
    specialNote: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#291812] border border-brass/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/80 text-ivory/80 hover:text-white transition-colors"
          aria-label="Close table reservation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="font-display text-2xl font-bold text-rice">
              Table Inquiry Received!
            </h3>

            <p className="font-marathi text-base text-turmeric">
              “आपलं सहर्ष स्वागत आहे!”
            </p>

            <p className="text-sm text-ivory/80 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{formData.name}</strong>. We have noted your request for {formData.partySize} guests ({formData.seatingPreference === "charpai" ? "Traditional Charpai Cot" : formData.seatingPreference}). We will keep the bhakris hot and your table ready!
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <a
                href={`tel:${RESTAURANT_DATA.location.phoneTel}`}
                className="py-3 px-4 rounded-xl bg-turmeric text-tamarind font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Restaurant Now for Instant Confirmation</span>
              </a>

              <button
                onClick={handleReset}
                className="py-2.5 text-xs text-ivory/60 hover:text-white underline"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-brass/20 pb-4 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#48251B] text-turmeric text-[11px] font-medium mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Table & Charpai Reservation</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-rice">
                Find Your Table
              </h3>
              <p className="text-xs text-ivory/70 mt-1">
                Enjoy hot Maharashtrian dishes freshly prepared upon arrival.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ivory/90 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1A0E08] border border-brass/30 text-rice text-sm focus:outline-none focus:border-turmeric placeholder:text-ivory/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ivory/90 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A0E08] border border-brass/30 text-rice text-sm focus:outline-none focus:border-turmeric placeholder:text-ivory/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory/90 mb-1">
                    Party Size
                  </label>
                  <select
                    value={formData.partySize}
                    onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A0E08] border border-brass/30 text-rice text-sm focus:outline-none focus:border-turmeric"
                  >
                    <option value="1-2">1–2 Diners</option>
                    <option value="3-4">3–4 Diners</option>
                    <option value="5-8">5–8 (Family)</option>
                    <option value="9+">9+ (Group)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ivory/90 mb-1">
                    Seating Type
                  </label>
                  <select
                    value={formData.seatingPreference}
                    onChange={(e) =>
                      setFormData({ ...formData, seatingPreference: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A0E08] border border-brass/30 text-rice text-sm focus:outline-none focus:border-turmeric"
                  >
                    <option value="charpai">Charpai (खाट) Cot</option>
                    <option value="upper-deck">Upper Open Deck</option>
                    <option value="patio">Gravel Courtyard</option>
                    <option value="standard">Standard Table</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory/90 mb-1">
                    Meal Time
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A0E08] border border-brass/30 text-rice text-sm focus:outline-none focus:border-turmeric"
                  >
                    <option value="dinner">Evening Dinner (7:30 – 11 PM)</option>
                    <option value="lunch">Lunch (12:00 – 4 PM)</option>
                    <option value="tea">Evening Snacks (4:30 – 6:30 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory/90 mb-1">
                  Food Preferences / Special Request
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pithla Bhakri, Maharashtrian Thali, mild spicy for kids"
                  value={formData.specialNote}
                  onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#1A0E08] border border-brass/30 text-rice text-sm focus:outline-none focus:border-turmeric placeholder:text-ivory/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-turmeric to-[#F7C05A] hover:from-[#F7C05A] hover:to-turmeric text-tamarind font-semibold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 mt-2"
              >
                <UtensilsCrossed className="w-4 h-4 text-tamarind" />
                <span>Confirm Table Request</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
