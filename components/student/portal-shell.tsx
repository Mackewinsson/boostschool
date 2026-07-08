import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";
import type { StudentContent } from "@/lib/student-content/types";

type PortalShellProps = {
  copy: StudentContent["portal"];
  children: ReactNode;
  teacherLink?: boolean;
};

export function PortalShell({ copy, children, teacherLink = false }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <header className="border-b border-border bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center">
            <span className="text-lg font-extrabold tracking-tight text-fg">Bilingual</span>
            <span className="ml-1.5 bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              Boost
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {teacherLink ? (
              <Link
                href="/alumno/profesor"
                className="text-sm font-medium text-fg-muted transition hover:text-accent"
              >
                {copy.teacherArea}
              </Link>
            ) : null}
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {copy.backHome}
        </Link>
        {children}
      </main>
    </div>
  );
}
