"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2,
  Building2,
  UserRound,
  Users,
} from "lucide-react";
import { Eczar } from "next/font/google";

const eczar = Eczar({ subsets: ["latin"], weight: ["400","500","600","700","800"]});


const postedByOptions = [
  {
    title: "Owner",
    subtitle: "Direct from property owners",
    description:
      "Find properties directly from owners. Connect with them to discuss the property and arrange a visit.",
    image: "/postedBy/Owner.png",
    icon: UserRound,
    number: "01",
    tag: "Direct connection",
  },
  {
    title: "Dealer",
    subtitle: "Explore agent-listed properties",
    description:
      "Browse properties listed by real estate dealers who can help you explore options and arrange viewings.",
    image: "/postedBy/Dealer.png",
    icon: Users,
    number: "02",
    tag: "More property options",
  },
  {
    title: "Builder",
    subtitle: "Discover new developments",
    description:
      "Explore new homes, residential projects, and properties listed by builders and developers.",
    image: "/postedBy/Builder.png",
    icon: Building2,
    number: "03",
    tag: "New developments",
  },
];

export default function PropertyPostedBy() {
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#fbfbf9] px-4 py-16 sm:px-7 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 24 }
          }
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
        >
  

          <h2 className="mt-5 text-3xl  tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Choose who you want
            <span className="block text-blue-900">
              to buy from
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Whether you prefer dealing directly with an owner,
            working with a dealer, or exploring builder projects,
            find the right way to discover your next property.
          </p>
        </motion.div>

        {/* Owner, Dealer and Builder cards */}
        <div className="grid grid-cols-1 items-stretch justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postedByOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.article
                key={option.title}
                initial={{
                  opacity: 0,
                  y: 45,
                  scale: 0.96,
                }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }
                    : {
                        opacity: 0,
                        y: 45,
                        scale: 0.96,
                      }
                }
                transition={{
                  duration: 0.65,
                  delay: index * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <Link
                  href={`/properties?posted_by=${encodeURIComponent(
                    option.title
                  )}`}
                  aria-label={`Explore properties listed by ${option.title.toLowerCase()}s`}
                  className="block h-full"
                >
                  {/* Property image */}
                  <div className="relative h-[300px] overflow-hidden sm:h-[350px]">
                    <img
                      src={option.image}
                      alt={`${option.title} property listing`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                    <span className={`absolute ${eczar.className} left-1/2 top-4 -translate-x-1/2 rounded-full px-4 py-1.5 text-2xl  uppercase text-white backdrop-blur-sm`}>
                      {option.title}
                    </span>

                    <span className="absolute bottom-4 left-5 font-mono text-sm text-white/80">
                      / {option.number}
                    </span>

                    <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={21} />
                    </div>
                  </div>

                
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}