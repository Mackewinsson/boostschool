"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

type PortalNavLinkProps = {
  label: string;
  className?: string;
};

export function PortalNavLink({
  label,
  className = "text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg",
}: PortalNavLinkProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return (
    <Link href="/alumno" className={className}>
      {label}
    </Link>
  );
}
