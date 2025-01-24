"use client"
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const router = useRouter(); // Next.js router instance
  const pathname = usePathname(); // Current pathname

  useEffect(() => {
    // Check if the current pathname is `/`
    if (pathname === "/") {
      // Redirect to `/tickets/all`
      router.push("/tickets/all");
    }
  }, [pathname, router]); // Run effect when pathname or router changes

  return (
    <div>
      {/* Empty component as users will be redirected */}
    </div>
  );
}
