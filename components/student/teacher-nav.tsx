"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StudentContent } from "@/lib/student-content/types";
import { teacherPaths } from "@/lib/teacher/paths";

type TeacherNavProps = {
  copy: StudentContent["teacher"];
};

const NAV = [
  { href: teacherPaths.home, key: "navMaterials", exact: true },
  { href: teacherPaths.leads, key: "navLeads" },
  { href: teacherPaths.contacts, key: "navContacts" },
  { href: teacherPaths.emails, key: "navEmails" },
  { href: teacherPaths.signature, key: "navSignature" },
] as const;

export function TeacherNav({ copy }: TeacherNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-wrap gap-2" aria-label={copy.navMaterials}>
      {NAV.map((item) => {
        const isExact = "exact" in item && item.exact;
        const isActive = isExact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "rounded-xl bg-accent/15 px-4 py-2 text-sm font-semibold text-accent"
                : "rounded-xl border border-border px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/30 hover:text-accent"
            }
          >
            {copy[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
