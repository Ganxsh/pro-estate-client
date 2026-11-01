
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0d4ec5]">
          Pro Estate
        </p>

        <h1 className="mt-6 text-8xl font-bold tracking-tight text-[#0d4ec5] sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, the page you are looking for doesn't exist,
          may have been moved, or is no longer available.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0d4ec5]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Browse Properties
          </Link>
        </div>
      </div>
    </main>
  );
}
