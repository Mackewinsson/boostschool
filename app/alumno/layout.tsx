import type { Metadata } from "next";
import { PortalShell } from "@/components/student/portal-shell";
import { getStudentContent } from "@/lib/student-content";
import { getLocaleFromCookies } from "@/lib/locale-server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AlumnoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookies();
  const { portal } = getStudentContent(locale);

  return <PortalShell copy={portal}>{children}</PortalShell>;
}
