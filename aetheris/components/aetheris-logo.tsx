"use client";

import Image from "next/image";

export function AetherisLogo({ className = "" }: { className?: string }) {
  // Replace 'aetheris-logo.png' with your actual logo filename
  return (
    <Image
      src="/aetheris-logo.png"
      alt="Aetheris"
      width={400}
      height={160}
      priority
      className={className}
    />
  );
}
