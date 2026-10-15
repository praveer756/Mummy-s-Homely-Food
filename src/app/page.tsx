"use client";

import React, { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero3DCanvas from "@/components/Hero3DCanvas";
import FoodShowcase from "@/components/FoodShowcase";
import ThaliExperience from "@/components/ThaliExperience";
import BrandPhilosophy from "@/components/BrandPhilosophy";
import RestaurantGallery from "@/components/RestaurantGallery";
import PlanYourVisit from "@/components/PlanYourVisit";
import Footer from "@/components/Footer";
import TableModal from "@/components/TableModal";

export default function Home() {
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const handleExploreMenu = () => {
    const el = document.getElementById("food-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#291812] text-rice selection:bg-turmeric selection:text-tamarind">
      {/* Full Page Cultural Preloader: completely loads 3D model, lights, and textures first */}
      <Preloader progress={loadProgress} isReady={modelReady} />

      {/* Top Header Navigation */}
      <Navbar onOpenTableModal={() => setTableModalOpen(true)} />

      {/* Primary Hero Section: Colorful 3D Blender Model with Damped Scroll-Driven Motion from Exterior to Table */}
      <Hero3DCanvas
        onExploreMenu={handleExploreMenu}
        onOpenTableModal={() => setTableModalOpen(true)}
        onLoadProgress={(p) => setLoadProgress(p)}
        onModelReady={() => setModelReady(true)}
      />

      {/* The Food That Feels Like Home: Authentic Maharashtrian Dishes */}
      <FoodShowcase onOpenTableModal={() => setTableModalOpen(true)} />

      {/* The Signature Maharashtrian Thali: Interactive Plate Exploration */}
      <ThaliExperience onOpenTableModal={() => setTableModalOpen(true)} />

      {/* Brand Philosophy: 3 Pillars (Flavours, Comfort, Gathering) */}
      <BrandPhilosophy />

      {/* The Restaurant Experience: Real Architectural Gallery */}
      <RestaurantGallery />

      {/* Plan Your Visit: Real Location Cues, Hours, Table Inquiry */}
      <PlanYourVisit />

      {/* Editorial Footer */}
      <Footer />

      {/* Table & Seating Reservation Modal */}
      <TableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
      />
    </main>
  );
}
