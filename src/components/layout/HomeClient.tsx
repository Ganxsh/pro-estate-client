"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/layout/Loading";
import Navbar from "@/components/layout/Navbar";
import InvestmentSearch from "@/components/home/InvestmentSearch";
import PropertyAdBanner from "@/components/home/PropertyAdBanner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import PropertyCategories from "@/components/home/PropertyCategories";
import BHKCategories from "@/components/home/BHKCategories";
import PropertyPostedBy from "@/components/home/PropertyPostedBy";
import OurService from "@/components/home/ourService";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQ from "@/components/home/FAQ";


export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="bg-white font-sans">
        <main>
          <div className="relative z-10">
            <Navbar />
          </div>
          <div className="relative z-20">
            <InvestmentSearch />
          </div>
          <div className="relative z-0">
            <PropertyAdBanner />
          </div>
          <div className="relative z-0">
            <FeaturedProperties />
          </div>
          <div className="relative z-0">
            <PropertyCategories />
          </div>
          <div className="relative z-0">
            <BHKCategories />
          </div>
          <div className="relative z-0">
            <PropertyPostedBy />
          </div>
          <div className="relative z-0">
            <OurService />
          </div>
          <div className="relative z-0">
            <TestimonialsSection />
          </div>
          <div className="relative z-0">
            <FAQ />
          </div>
        </main>
      
      </div>
    </>
  );
}
