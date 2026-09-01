import type { StudentContent } from "@/lib/student-content/types";

export function managedUserFormError(
  error: string | undefined,
  copy: StudentContent["teacher"],
): string | null {
  if (!error) {
    return null;
  }
  if (error === "self") {
    return copy.usersErrorSelf;
  }
  if (error === "lastAdmin") {
    return copy.usersErrorLastAdmin;
  }
  if (error === "parentStudent") {
    return copy.usersErrorParentStudent;
  }
  if (error === "password") {
    return copy.usersErrorPassword;
  }
  if (error === "passwordMismatch") {
    return copy.usersErrorPasswordMismatch;
  }
  return copy.usersErrorGeneric;
}
