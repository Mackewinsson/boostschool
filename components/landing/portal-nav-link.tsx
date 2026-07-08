"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

type PortalNavLinkProps = {
  portalLabel: string;
  signInLabel: string;
  className?: string;
  onClick?: () => void;
};

export function PortalNavLink({
  portalLabel,
  signInLabel,
  className = "text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg",
  onClick,
}: PortalNavLinkProps) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <Link href="/alumno" className={className} onClick={onClick}>
        {portalLabel}
      </Link>
    );
  }

  return (
    <Link href="/sign-in" className={className} onClick={onClick}>
      {signInLabel}
    </Link>
  );
}
