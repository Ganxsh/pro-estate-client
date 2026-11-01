"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RealEstateLoaderProps {
  isLoading?: boolean;
  onLoadingComplete?: () => void;
}

const logoBlocks = [
  // Block 1 — Upper-left shape
  `M952.2 242.1c-14.6 1.9-20.1 4.3-49.8 22.7-11.5 7.1-25.2 15.5-30.4 18.7-18.5 11.3-40.6 24.9-51.5 31.5-6 3.7-15.9 9.7-22 13.5-6 3.7-18.9 11.6-28.5 17.5s-20.6 12.6-24.5 15c-3.8 2.4-14.9 9.1-24.5 15s-22.2 13.6-28 17.2c-5.8 3.5-20.6 12.7-33 20.3-12.4 7.5-28.1 17.3-35 21.5-23 14.3-60.4 37.2-66.5 40.8-13.8 8.1-21.8 15.9-26.9 25.9-12 24-3.9 50.9 20.1 66.1 15.5 9.9 50.6 28.4 116.8 61.6 38.5 19.4 74.7 37.3 80.5 39.8 5.8 2.6 15.7 7 22 9.8 16.1 7.3 37.2 15.4 45.5 17.6 5.5 1.5 10.5 1.9 23.5 1.9 15.3 0 17.1-.2 24.5-2.7 15.4-5.2 30.9-16.9 41.6-31.4 7.1-9.7 14.7-25.7 25-52.5 5.6-14.5 11-29.1 12.1-32.4s4.4-12.3 7.3-20c3-7.7 13.8-36.5 24-64 19.8-53 29.2-77.4 43.7-113 18.5-45.3 19.5-49.2 18.5-66.5-1.1-17.5-6.2-31.2-16.6-44.3-16.9-21.2-43.3-32.8-67.9-29.6z`,

  // Block 2 — Right vertical shape
  `M1090 387.3c-6.7 1.6-16.7 6.6-21.5 10.9-11.3 9.9-21.9 32.4-41.2 87.3-21.7 61.7-40.2 128.9-49.7 180.5-6.6 35.9-8 46.8-10.1 76.4-1.9 27.6-1.9 44.5 0 68.1 4.5 54.9 13.2 90.6 41.7 170.5 18.7 52.5 33.9 91.6 39.9 102.6 8.9 16.4 24.1 30.3 40.4 37.1 12.3 5.2 14.3 5.3 101.7 5.3 75.5 0 81.9-.2 90.4-1.9 38.9-8 69.3-40.7 75.9-81.6 2.3-13.8 2.2-428.4 0-442.5-3.6-22.6-13.8-45.5-28.1-63.4-16.1-20-29.3-29.9-100.5-75.4-12.3-7.9-34.3-22-48.9-31.3s-29.4-18.8-33-21.1-11-7.1-16.5-10.7-12.5-7.5-15.5-8.7c-7-2.9-17.8-3.7-25-2.1z`,

  // Block 3 — Lower-left shape
  `M513 610.7c-17.6 2-33.5 10.6-44.3 24-7.4 9.1-12.4 19.4-14.8 30.4-1.9 8.8-1.9 12.8-1.6 189.2.3 164.7.5 180.8 2 187.7 6.4 28.5 22.4 52 45.1 66.5 8.9 5.7 23 12 32.6 14.6l8.5 2.4 191.5.3c213.2.3 198.6.7 213.3-6.5 19.7-9.9 32.2-32.5 30.2-54.8-2.2-24.6-35-116.9-55.3-155.5-18.8-35.8-35.9-61.1-57.9-86-32.5-36.8-59.6-57.2-128.8-97.2-7.1-4.1-17.5-10.1-23-13.3-20.1-11.6-49.2-28.2-56-32-3.8-2.1-12.2-6.8-18.5-10.5s-21.4-12.5-33.5-19.5c-12.1-7.1-29.2-17.4-38-22.9s-19.1-11.2-23-12.7c-6.1-2.4-20.4-5.2-23.8-4.7-.7 0-2.8.3-4.7.5z`,
];

export default function Loading({
  isLoading = true,
  onLoadingComplete,
}: RealEstateLoaderProps) {
  const [isFinished, setIsFinished] = useState(false);
  const TOTAL_DURATION = 3.0; 
  const BLOCK_TIME = TOTAL_DURATION / logoBlocks.length;

  const handleAnimationComplete = () => {
    setIsFinished(true);
    if (onLoadingComplete) onLoadingComplete();
  };

  return (
    <AnimatePresence>
      {isLoading && !isFinished && (
        <motion.div
          role="status"
          aria-label="Loading Pro Estate"
          initial={{ opacity: 1, y: 0 }}
          exit={{ 
            opacity: 1, 
            y: "-100%" 
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1] // Custom smooth cubic-bezier for sliding up
          }}
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#080D14] text-white"
        >
          {/* Background ambient glow */}
          <motion.div
            aria-hidden="true"
            animate={{
              scale: [0.85, 1.15, 0.85],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute h-80 w-80 rounded-full bg-emerald-300/20 blur-[90px]"
          />

          <div className="relative flex w-full max-w-lg flex-col items-center px-6">
            {/* Three-part animated logo */}
            <div className="relative w-full max-w-[340px]">
              <motion.div
                aria-hidden="true"
                animate={{ opacity: [0.1, 0.35, 0.1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-[20%] rounded-full bg-emerald-100/20 blur-3xl"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1810 1358"
                className="relative h-auto w-full overflow-visible"
                aria-hidden="true"
              >
                {logoBlocks.map((path, index) => {
                  const startDelay = index * BLOCK_TIME;
                  const drawDuration = BLOCK_TIME * 0.7;
                  const fillDuration = BLOCK_TIME * 0.3;

                  return (
                    <g key={index}>
                      {/* Stroke draws first */}
                      <motion.path
                        d={path}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          duration: drawDuration,
                          delay: startDelay,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Fill fades in right after stroke completes */}
                      <motion.path
                        d={path}
                        fill="#FFFFFF"
                        stroke="none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: fillDuration,
                          delay: startDelay + drawDuration,
                          ease: "easeInOut",
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 text-center"
            >
              <h1 className="text-lg font-semibold tracking-[0.28em] sm:text-xl">
                Pro Estate
              </h1>

              <p className="mt-3 text-xs tracking-[0.16em] text-slate-400">
                SPACES THAT FEEL LIKE HOME
              </p>
            </motion.div>

            {/* Loading progress bar tracked to exact 3-sec duration */}
            <div className="mt-12 w-full max-w-[220px]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.18em] text-slate-400">
                  DISCOVERING PROPERTIES
                </span>

                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-xs text-emerald-200"
                >
                  •••
                </motion.span>
              </div>

              <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full w-full origin-left rounded-full bg-gradient-to-r from-emerald-600 via-emerald-200 to-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: TOTAL_DURATION,
                    ease: "easeInOut",
                  }}
                  onAnimationComplete={handleAnimationComplete}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}