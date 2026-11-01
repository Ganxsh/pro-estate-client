
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import { Eczar } from "next/font/google";

const eczar = Eczar({ subsets: ["latin"], weight: ["400","500","600","700","800"]});

export default function PropertyAdBanner() {
  return (
    <section className="px-4 py-12 pt-24  sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl">
        {/* Banner background */}
        <div className="relative isolate min-h-[270px] overflow-hidden rounded-[22px] bg-gradient-to-r from-[#17374A] via-[#244D6C] to-[#5787B2] sm:min-h-[290px]">
          {/* Decorative background lighting */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(255,255,255,0.16),transparent_45%)]"
          />

          <div
            aria-hidden="true"
            className="absolute -right-20 -top-36 h-80 w-80 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute right-10 top-8 h-56 w-56 rounded-full border border-white/[0.07]"
          />

          {/* Text content */}
          <div className="relative z-10 flex min-h-[270px] max-w-[60%] flex-col justify-center px-6 py-8 sm:min-h-[290px] sm:px-10 lg:px-14">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100 sm:text-xs">
              <MapPin size={13} />
              <span>Discover ProEstate</span>
            </div>

            <h2 className={`max-w-[450px]  text-2xl font-medium leading-12 tracking-wide text-white sm:text-3xl lg:text-[50px] ${eczar.className} `}>
             <span className="font-light ">
             Find Your Dream    
              </span>   
              <br />
            Property.
            </h2>

            <p className="mt-3 max-w-[330px] text-xs leading-relaxed text-blue-100/90 sm:text-sm">
              Explore exceptional homes and investment opportunities
              in locations you'll love.
            </p>

            <Link
              href="/properties"
              className="group mt-5 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#18394D] transition duration-300 hover:bg-sky-50 sm:text-sm"
            >
              Explore Properties
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            
          </div>
        </div>

        {/* Building protrudes above and overlaps the banner */}
        <div className="pointer-events-none absolute -right-1 bottom-0 top-[-48px] z-20 w-[54%] sm:right-2 sm:top-[-65px] sm:w-[48%] lg:right-8 lg:top-[-95px] lg:w-[42%]">
         <Image src="/Apartment-image/Modern Luxury Apartment Complex.png" alt="Property Banner Illustration" width={700} height={700} className="h-full w-full object-contain" />
        </div>
      </div>
    </section>
  );
}
