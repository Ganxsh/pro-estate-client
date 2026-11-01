"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../layout/Navbar";

function NavbarContent() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navbar />;
}

export default function ConditionalNavbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
