
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Compass,
  Handshake,
  Heart,
  House,
  MapPin,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "Make informed property decisions with clear information and a transparent experience.",
  },
  {
    icon: Zap,
    title: "Simple & Convenient",
    description:
      "Discover, compare, and explore properties through a smooth browsing experience.",
  },
  {
    icon: Users,
    title: "People First",
    description:
      "We put the needs of property seekers and property listers at the heart of our platform.",
  },
  {
    icon: Building2,
    title: "More Choices",
    description:
      "Explore different property types, locations, and opportunities in one place.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore properties by city, budget, property type, and your preferences.",
  },
  {
    number: "02",
    title: "Compare",
    description:
      "Review property details and shortlist the options that fit your needs.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Reach out about properties and take the next step toward your goals.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white text-[#172A27]">
      {/* HERO */}
      <section className="relative">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#0f3fc2]/5 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pb-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0f3fc2]/10 bg-[#0f3fc2]/5 px-4 py-2 text-sm font-semibold text-[#0f3fc2]">
              <Compass size={16} />
              About Pro Estate
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Helping You Find a Place to{" "}
              <span className="text-[#0f3fc2]">Call Home.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Finding the right property is more than a search. It is
              about discovering possibilities, planning your future, and
              finding a place that feels right. Pro Estate makes exploring
              real estate simpler and more convenient.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f3fc2] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b3b32]"
              >
                Explore Properties
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-[#0f3fc2] hover:text-[#0f3fc2]"
              >
                Get in Touch
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#0f3fc2]" />
                Easy property discovery
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#0f3fc2]" />
                Multiple property types
              </span>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#DCEBE5] sm:-right-6 sm:-top-6 sm:h-44 sm:w-44" />

            <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full border border-[#0f3fc2]/20 sm:-bottom-7 sm:-left-7 sm:h-40 sm:w-40" />

            <div className="relative overflow-hidden rounded-[28px] bg-[#E6EEE9] shadow-xl shadow-[#0f3fc2]/10">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85"
                alt="Modern contemporary home surrounded by greenery"
                className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[520px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#102D27]/65 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                  Your next chapter starts here
                </p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Find your place.
                  <br />
                  Build your future.
                </h2>
              </div>
            </div>

            <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:right-7 sm:p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f3fc2]/10 text-[#0f3fc2]">
                <House size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Your property journey
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Starts with the right search
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="border-y border-gray-100 bg-[#F8FAF8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0f3fc2]">
              Who We Are
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Real estate discovery, made more approachable.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-gray-600">
            <p>
              Pro Estate is a property discovery platform designed to
              help people explore real estate opportunities with greater
              clarity and convenience.
            </p>
            <p>
              Whether you are searching for an apartment, an independent
              house, a residential plot, or a farm house, our goal is to
              make it easier to explore available options and understand
              the details that matter to you.
            </p>
            <p>
              We also provide a platform for property owners, dealers,
              and builders to present their listings to people looking
              for their next property.
            </p>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div className="relative">
          <div className="overflow-hidden rounded-[26px] bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
              alt="Modern buildings representing real estate and urban development"
              className="h-[320px] w-full object-cover sm:h-[420px]"
              loading="lazy"
            />
          </div>

          <div className="absolute -bottom-5 right-4 rounded-2xl bg-[#0f3fc2] p-5 text-white shadow-xl sm:right-8 sm:p-6">
            <Target size={28} />
            <p className="mt-3 text-lg font-semibold">Our Vision</p>
            <p className="mt-1 max-w-[220px] text-sm leading-6 text-white/80">
              Make property discovery more accessible and straightforward.
            </p>
          </div>
        </div>

        <div className="pt-5 lg:pt-0">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0f3fc2]">
            Our Story
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Every great place begins with the right choice.
          </h2>
          <p className="mt-6 text-base leading-8 text-gray-600">
            Searching for a property can involve comparing locations,
            understanding property details, evaluating budgets, and
            contacting the right people. We believe this process should
            feel organized rather than overwhelming.
          </p>
          <p className="mt-4 text-base leading-8 text-gray-600">
            That is why Pro Estate brings property listings and discovery
            tools together in one place, helping you move from browsing
            to taking the next step with greater confidence.
          </p>

          <ul className="mt-7 space-y-4">
            {[
              "A straightforward property browsing experience",
              "Useful details to help compare your options",
              "Property listings from owners, dealers, and builders",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-[#0f3fc2]"
                />
                <span className="text-sm leading-6 text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#F5F8F5]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0f3fc2]">
              Why Pro Estate
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              More than just property listings.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              We focus on the things that can make your property search
              clearer, easier, and more useful.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0f3fc2]/20 hover:shadow-xl hover:shadow-[#0f3fc2]/5 sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f3fc2]/10 text-[#0f3fc2] transition group-hover:bg-[#0f3fc2] group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#101a4e]">
              A Simpler Journey
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              From searching to finding your next property.
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-600">
              A simple way to start exploring properties that match your
              requirements.
            </p>

            <Link
              href="/properties"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0f3fc2] hover:gap-3"
            >
              Start exploring
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-2xl border border-gray-100 p-5 transition hover:border-[#0f3fc2]/20 sm:gap-6 sm:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f3fc2] text-sm font-bold text-white">
                  {step.number}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0f3fc2]">
                Explore Possibilities
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Find the property that fits your plans.
              </h2>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f3fc2]"
            >
              View Properties
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Apartments",
                description: "Explore residential apartment listings.",
                icon: Building2,
              },
              {
                title: "Residential Plots",
                description: "Discover land for your future plans.",
                icon: Compass,
              },
              {
                title: "Independent Houses & Villas",
                description: "Find a home with space of your own.",
                icon: House,
              },
              {
                title: "Farm Houses",
                description: "Explore properties beyond city living.",
                icon: MapPin,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href="/properties"
                  className="group rounded-2xl bg-[#F5F8F5] p-6 transition hover:bg-[#EAF2ED]"
                >
                  <Icon
                    size={28}
                    className="text-[#0f3fc2] transition group-hover:scale-110"
                  />
                  <h3 className="mt-5 font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f3fc2]">
                    Explore
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    
    </main>
  );
}
