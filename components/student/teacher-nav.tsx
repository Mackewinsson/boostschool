"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { StudentContent } from "@/lib/student-content/types";
import { teacherPaths } from "@/lib/teacher/paths";

type TeacherNavProps = {
  copy: StudentContent["teacher"];
  showUsersNav?: boolean;
};

const NAV = [
  { href: teacherPaths.students, key: "navStudents" as const },
  { href: teacherPaths.home, key: "navMaterials" as const, exact: true },
  { href: teacherPaths.leads, key: "navLeads" as const },
  { href: teacherPaths.contacts, key: "navContacts" as const },
  { href: teacherPaths.emails, key: "navEmails" as const },
  { href: teacherPaths.signature, key: "navSignature" as const },
] as const;

export function TeacherNav({ copy, showUsersNav = false }: TeacherNavProps) {
  const pathname = usePathname();
  const items = [
    ...NAV,
    ...(showUsersNav
      ? ([{ href: teacherPaths.users, key: "navUsers" as const }] as const)
      : []),
  ];

  return (
    <nav className="mt-8 flex flex-wrap gap-2" aria-label={copy.navMaterials}>
      {items.map((item) => {
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
