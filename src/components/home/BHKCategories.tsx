
"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { propertyApi } from "@/lib/propertyApi";

const bhkCategories = [
  { label: "1 RK / 1 BHK", bedrooms: 1 },
  { label: "2 BHK",         bedrooms: 2 },
  { label: "3 BHK",         bedrooms: 3 },
  { label: "4 BHK",         bedrooms: 4 },
  { label: "5+ BHK",        bedrooms: 5 },
];

export default function BHKCategories() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    async function fetchCounts() {
      const results = await Promise.all(
        bhkCategories.map((c) => propertyApi.getAll({ bedrooms: c.bedrooms }))
      );
      const map: Record<number, number> = {};
      results.forEach((res, i) => {
        const list = Array.isArray(res) ? res : (res.properties ?? []);
        map[bhkCategories[i].bedrooms] = list.length;
      });
      setCounts(map);
    }
    fetchCounts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    sliderRef.current?.scrollBy({
      left: direction === "right" ? 260 : -260,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-3 py-5 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-gradient-to-r from-[#17374A] via-[#244D6C] to-[#5787B2] px-5 pb-0 pt-7 sm:px-8 sm:pt-9 lg:px-12">
        {/* Section heading */}
        <div className="mb-8 flex items-center gap-4 sm:mb-10">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 72 72"
              fill="none"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M9 57C2 48 9 26 15 12C21 0 27 23 29 38L25 63Z"
                fill="#FFC778"
              />
              <path
                d="M19 29L42 11L65 29"
                stroke="#0786E8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M24 27L42 14L60 27V65H24Z" fill="#B8D2F8" />
              <path
                d="M39 65V43H52V65"
                fill="#F8FBFF"
              />
              <path
                d="M31 27H38V34H31ZM41 27H48V34H41ZM31 37H38V44H31ZM41 37H48V44H41Z"
                fill="white"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              BHK choice in mind?
            </h2>
            <p className="mt-1.5 text-sm text-gray-300 sm:text-base">
              Browse by no. of bedrooms in the house
            </p>
          </div>
        </div>

        {/* Cards carousel */}
        <div
          ref={sliderRef}
          className="flex snap-x  snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {bhkCategories.map((category) => (
            <button
              key={category.bedrooms}
              type="button"
              onClick={() => {
                window.location.href = `/properties?bedrooms=${category.bedrooms}`;
              }}
              className="group flex h-[202px] w-[240px] shrink-0 snap-start flex-col items-start rounded-xl border border-[#e9e9e5] bg-white px-7 py-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:w-[242px] lg:w-[calc((100%-32px)/4)]"
            >
              {/* House icon */}
              <div className="mb-7 flex h-12 items-center text-[#087fce]">
                <svg
                  viewBox="0 0 64 48"
                  className="h-11 w-14 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M7 20L22 5H43L58 16" fill="#0786D8" />
                  <path d="M7 20L22 5H43L58 16" stroke="#0786D8" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 19H40V44H12Z" fill="#B9D3F7" />
                  <path d="M35 24H51V44H35Z" fill="#E4EEFC" />
                  <path d="M18 25H23V30H18ZM26 25H31V30H26ZM18 33H23V38H18ZM26 33H31V38H26Z" fill="white" />
                  <path d="M40 18L50 23V44H40Z" fill="#F5F9FF" />
                </svg>
              </div>

              <h3 className="text-base font-semibold text-[#142b49] sm:text-lg">
                {category.label}
              </h3>

              <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
                {counts[category.bedrooms] !== undefined
                  ? `${counts[category.bedrooms]} ${counts[category.bedrooms] === 1 ? "Property" : "Properties"}`
                  : "Loading..."}
              </p>
            </button>
          ))}
        </div>

        {/* Carousel arrows */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Previous BHK categories"
          className="absolute left-0 top-[62%] z-10 hidden h-10 w-10 -translate-x-1/3 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-md transition hover:text-blue-600 sm:flex"
        >
          <ChevronLeft size={21} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next BHK categories"
          className="absolute right-3 top-[62%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-md transition hover:text-blue-600 sm:right-5"
        >
          <ChevronRight size={21} />
        </button>
      </div>
    </section>
  );
}
