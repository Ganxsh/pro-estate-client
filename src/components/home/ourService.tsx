
"use client";

import Link from "next/link";
import {
  House,
  Building2,
  Store,
  CalendarDays,
  Building,
  Ellipsis,
} from "lucide-react";

const categories = [
  {
    title: "Houses",
    icon: House,
    href: "/properties?property_type=Independent%20House%20%2F%20Villa",
  },
  {
    title: "Apartments",
    icon: Building2,
    href: "/properties?property_type=Residential%20Apartment",
  },
  {
    title: "Commercial",
    icon: Store,
    href: "/properties?property_type=Commercial",
  },
  {
    title: "Daily rental",
    icon: CalendarDays,
    href: "/properties?listing_type=Daily%20rental",
  },
  {
    title: "New buildings",
    icon: Building,
    href: "/properties?posted_by=Builder",
  },
  {
    title: "More",
    icon: Ellipsis,
    href: "/properties",
  },
];

export default function OurService() {
  return (
    <section className=" bg-[#fbfbf9] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="group flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white px-2 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF0EC] text-[#E98C79] transition-colors duration-300 group-hover:bg-[#1c398e] group-hover:text-white">
                  <Icon size={17} strokeWidth={1.8} />
                </span>

                <span className="text-center text-[11px] font-semibold text-slate-800 sm:text-xs">
                  {category.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
