import { redirect } from "next/navigation";
import { getAuthContext, getPortalPathForRole } from "@/lib/materials/auth";

export default async function AlumnoRedirectPage() {
  const context = await getAuthContext();
  if (!context) {
    redirect("/sign-in");
  }
  redirect(getPortalPathForRole(context.role));
}
