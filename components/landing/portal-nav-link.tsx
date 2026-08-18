"use client";

import Link from "next/link";

type PortalNavLinkProps = {
  signInLabel: string;
  className?: string;
  onClick?: () => void;
};

export function PortalNavLink({
  signInLabel,
  className = "text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-fg",
  onClick,
}: PortalNavLinkProps) {
  return (
    <Link href="/sign-in" className={className} onClick={onClick}>
      {signInLabel}
    </Link>
  );
}
