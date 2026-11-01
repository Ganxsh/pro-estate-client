
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";


const categories = [
  {
    title: "Residential Apartment",
    subtitle: "Apartments & Flats",
    image: "/PropertyCategories/Twilight Geometry_ Modern Apartment Corner.png",
  },
  {
    title: "Residential Plot",
    subtitle: "Land & Plots",
    image: "/PropertyCategories/Sunset Serenity at Plot 12.png",
  },
  {
    title: "Independent House / Villa",
    subtitle: "Independent Living",
    image: "/PropertyCategories/Symmetrical Modern Villa at Dusk.png",
  },
  {
    title: "Farm House",
    subtitle: "Space to unwind",
    image: "/PropertyCategories/Moody Modern Farmhouse at Dusk.png",
  },
] as const;

export default function PropertyCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
         

            <h2 className=" text-2xl tracking-normal text-slate-900 sm:text-3xl">
              Apartment ,Villas and more...
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Discover properties that match your lifestyle.
            </p>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous property categories"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next property categories"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal card carousel */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
        >
          {categories.map((category) => (
            <Link
              key={category.title}
              href={`/properties?property_type=${encodeURIComponent(category.title)}`}
              className="group shadow-md border border-gray-300 relative h-[320px] w-[82vw] max-w-[240px] shrink-0 snap-start overflow-hidden rounded-xl text-left sm:h-[350px] sm:w-[calc(50%-12px)] lg:h-[370px] lg:w-[calc(33.333%-16px)]"
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/15 to-black/35" />
              <div className="absolute inset-x-0 top-0 p-6 sm:p-7">
                <p className="max-w-[250px] text-xl font-bold leading-6 text-slate-700 sm:text-2xl">
                  {category.title}
                </p>
                <p className="mt-2 text-sm text-slate-500">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile scroll controls */}
        <div className="mt-4 flex justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous categories"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200"
          >
            <ChevronLeft size={19} />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next categories"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
