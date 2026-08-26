import { redirect } from "next/navigation";
import { teacherPaths } from "@/lib/teacher/paths";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function AdminRedirectPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const [section, id] = slug;

  if (section === "firma") {
    redirect(teacherPaths.signature);
  }
  if (section === "emails") {
    redirect(teacherPaths.emails);
  }
  if (section === "leads") {
    redirect(id ? teacherPaths.lead(id) : teacherPaths.leads);
  }
  if (section === "contacts") {
    redirect(id ? teacherPaths.contact(id) : teacherPaths.contacts);
  }
  if (section === "usuarios" || section === "users") {
    redirect(id ? teacherPaths.user(id) : teacherPaths.users);
  }
  if (section === "estudiantes" || section === "students") {
    redirect(teacherPaths.students);
  }

  redirect(teacherPaths.home);
}
