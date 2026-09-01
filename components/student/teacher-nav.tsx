"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Inbox, Mail, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StudentContent } from "@/lib/student-content/types";
import { teacherPaths } from "@/lib/teacher/paths";

type TeacherCopy = StudentContent["teacher"];
type TeacherNavProps = {
  copy: TeacherCopy;
  showUsersNav?: boolean;
};

type SubItem = {
  href: string;
  labelKey: keyof Pick<
    TeacherCopy,
    "navStudents" | "navUsers" | "navLeads" | "navContacts" | "navEmails" | "navSignature"
  >;
  adminOnly?: boolean;
};

type NavGroup = {
  id: "classes" | "people" | "crm" | "mail";
  href: string;
  labelKey: keyof Pick<
    TeacherCopy,
    "navGroupClasses" | "navGroupPeople" | "navGroupCrm" | "navGroupMail"
  >;
  icon: LucideIcon;
  items: SubItem[];
};

const GROUPS: NavGroup[] = [
  {
    id: "classes",
    href: teacherPaths.home,
    labelKey: "navGroupClasses",
    icon: CalendarDays,
    items: [],
  },
  {
    id: "people",
    href: teacherPaths.students,
    labelKey: "navGroupPeople",
    icon: Users,
    items: [
      { href: teacherPaths.students, labelKey: "navStudents" },
      { href: teacherPaths.users, labelKey: "navUsers", adminOnly: true },
    ],
  },
  {
    id: "crm",
    href: teacherPaths.leads,
    labelKey: "navGroupCrm",
    icon: Inbox,
    items: [
      { href: teacherPaths.leads, labelKey: "navLeads" },
      { href: teacherPaths.contacts, labelKey: "navContacts" },
    ],
  },
  {
    id: "mail",
    href: teacherPaths.emails,
    labelKey: "navGroupMail",
    icon: Mail,
    items: [
      { href: teacherPaths.emails, labelKey: "navEmails" },
      { href: teacherPaths.signature, labelKey: "navSignature" },
    ],
  },
];

function isItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, group: NavGroup): boolean {
  if (group.id === "classes") {
    return pathname === teacherPaths.home;
  }
  return group.items.some((item) => isItemActive(pathname, item.href));
}

export function TeacherNav({ copy, showUsersNav = false }: TeacherNavProps) {
  const pathname = usePathname();
  const activeGroup =
    GROUPS.find((group) => isGroupActive(pathname, group)) ?? GROUPS[0];
  const subItems = activeGroup.items.filter(
    (item) => !item.adminOnly || showUsersNav,
  );

  return (
    <div className="admin-nav">
      <nav className="admin-nav__primary" aria-label={copy.navAria} data-testid="teacher-nav">
        {GROUPS.map((group) => {
          const Icon = group.icon;
          const active = group.id === activeGroup.id;
          return (
            <Link
              key={group.id}
              href={group.href}
              aria-current={active ? "page" : undefined}
              className={
                active ? "admin-nav__link admin-nav__link--active" : "admin-nav__link"
              }
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              {copy[group.labelKey]}
            </Link>
          );
        })}
      </nav>

      {subItems.length > 0 ? (
        <nav
          className="admin-nav__secondary"
          aria-label={copy.navSubAria}
          data-testid="teacher-subnav"
        >
          {subItems.map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active ? "admin-nav__chip admin-nav__chip--active" : "admin-nav__chip"
                }
              >
                {copy[item.labelKey]}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
