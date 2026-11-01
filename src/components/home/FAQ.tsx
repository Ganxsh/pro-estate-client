"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "What is ProEstate?",
    answer:
      "ProEstate is an Indian real-estate platform where you can buy, sell, or rent properties. Browse listings from owners, dealers, and builders across cities — all in one place.",
  },
  {
    question: "How do I search for a property?",
    answer:
      "Use the search bar to find properties by city, title, address, or type. You can also filter by property type, BHK, budget, and who posted the listing.",
  },
  {
    question: "Can I contact the property owner directly?",
    answer:
      "Yes. Open any property listing and submit an inquiry with your message and phone number. The owner will be notified by email and can reach out to you directly.",
  },
  {
    question: "What types of properties are listed?",
    answer:
      "ProEstate lists Residential Apartments, Residential Plots, Independent Houses / Villas, and Farm Houses — covering both buy and rent options.",
  },
  {
    question: "Is posting a property free?",
    answer:
      "Yes. Listing your property on ProEstate is completely free. Create an account, click Post Property, fill in the details, and your listing goes live instantly.",
  },
  {
    question: "Who can post a property?",
    answer:
      "Anyone with an account can post — whether you are an Owner, Dealer, or Builder. Select the correct category when creating your listing.",
  },
  {
    question: "Can I edit or delete my listing?",
    answer:
      "Yes. Go to My Properties from the navbar, and you can edit details, update images, or delete any listing you have posted.",
  },
  {
    question: "How do I verify if a listing is genuine?",
    answer:
      "Review the listing details carefully and independently verify ownership documents, approvals, and encumbrances before making any payment or commitment.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      className="overflow-hidden flex justify-center bg-[#fbfbf9] px-4 py-16 sm:px-7 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="grid grid-cols-1 max-w-7xl lg:grid-cols-12 gap-10 sm:gap-14 items-start pt-6 border-t border-neutral-100">
        {/* LEFT */}
        <div className="lg:col-span-5 pr-0 lg:pr-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-[#1c398e]" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-neutral-500">
              Got Questions?
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111111] leading-tight mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-md">
            Everything you need to know about buying, selling, and renting
            properties on ProEstate. Can&apos;t find your answer? Reach out to
            us anytime.
          </p>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-neutral-200/80 last:border-b-0 py-4 sm:py-5 first:pt-2 last:pb-2"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-medium text-[#111111] group-hover:text-neutral-600 transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-lg text-neutral-400 group-hover:text-black transition-colors font-light shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden mt-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
