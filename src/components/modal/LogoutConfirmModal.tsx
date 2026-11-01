"use client";

import Image from "next/image";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  isLoading = false,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#171717]/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Modal wrapper */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        onClick={(event) => event.stopPropagation()}
        className="relative z-10 my-auto w-full max-w-[410px] scale-75 overflow-visible rounded-[34px] bg-transparent"
      >
        {/* Illustration section */}
        <div className="relative h-[225px] rounded-t-[34px] bg-white sm:h-[200px]">
     
          {/* Floating illustration */}
          <div
            className="
              absolute
              left-1/2
              top-0
              z-20
              w-[85%]
              -translate-x-1/2
              -translate-y-[25%]
              [perspective:1000px]
            "
          >
            <Image
              src="/illustration/Logout.png"
              alt="Person walking through an exit door"
              width={500}
              height={400}
              priority
              className="
                h-auto
                w-full
                object-contain
                [transform:rotateX(4deg)_rotateY(-4deg)]
                transition-transform
                duration-500
                ease-out
                hover:[transform:rotateX(0deg)_rotateY(0deg)_translateY(-5px)]
              "
            />
          </div>

          {/* Decorative geometric shapes */}
          <span className="pointer-events-none absolute right-[15%] top-[22%] z-30 h-4 w-4 rotate-12 border-[3px] border-black" />

          <span className="pointer-events-none absolute bottom-[16%] right-[17%] z-30 h-3 w-3 rotate-12 border-2 border-black" />
        </div>

        {/* Modal content */}
        <div className="relative z-10 rounded-b-[34px] bg-white px-6 pb-7 pt-5 text-center shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:px-8 sm:pb-9 sm:pt-6">
          <h2
            id="logout-title"
            className="text-[29px] font-extrabold tracking-tight text-[#151515] sm:text-[34px]"
          >
            Log out?
          </h2>

          <p className="mx-auto mt-3 max-w-[310px] text-sm leading-6 text-[#85838b] sm:text-base">
            Are you sure you want to log out of your ProEstate account?
          </p>

          {/* Action buttons */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex min-h-[52px] cursor-pointer items-center justify-center rounded-full bg-[#ff2929] px-4 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#e91e1e] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {isLoading ? "Logging out..." : "Log out"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="min-h-[52px] cursor-pointer rounded-full bg-[#171717] px-4 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
