import { clerkClient } from "@clerk/nextjs/server";
import { getRoleFromMetadata } from "./auth";
import type { StudentSummary } from "./types";

export async function listStudents(): Promise<StudentSummary[]> {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });

  return users.data
    .filter((user) => getRoleFromMetadata(user.id, user.publicMetadata) === "student")
    .map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      firstName: user.firstName,
      lastName: user.lastName,
    }))
    .filter((user) => user.email.length > 0)
    .sort((a, b) => a.email.localeCompare(b.email));
}
