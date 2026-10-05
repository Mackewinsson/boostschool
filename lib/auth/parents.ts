import { getDb } from "@/lib/db/client";
import { createUser, findUserById } from "./users";

const STUDENT_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ParentStudentRow = {
  student_user_id: string;
  student_name: string;
};

export type LinkedStudent = {
  id: string;
  name: string;
};

function mapLinkedStudent(row: ParentStudentRow): LinkedStudent {
  return {
    id: row.student_user_id,
    name: row.student_name,
  };
}

export async function listLinkedStudentsForParent(
  parentUserId: string,
): Promise<LinkedStudent[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT ps.student_user_id, u.name AS student_name
    FROM parent_students ps
    INNER JOIN users u ON u.id = ps.student_user_id
    WHERE ps.parent_user_id = ${parentUserId}::uuid
    ORDER BY u.name ASC, u.email ASC
  `) as ParentStudentRow[];

  return rows.map(mapLinkedStudent);
}

export async function getLinkedStudentForParent(
  parentUserId: string,
): Promise<LinkedStudent | null> {
  const students = await listLinkedStudentsForParent(parentUserId);
  return students[0] ?? null;
}

/** Linked students for a parent, plus the one to show. Unknown ids fall back to the first. */
export async function getParentPortalView(
  parentUserId: string,
  preferredStudentId?: string | null,
): Promise<{ linkedStudents: LinkedStudent[]; active: LinkedStudent | null }> {
  const linkedStudents = await listLinkedStudentsForParent(parentUserId);
  const preferred = preferredStudentId?.trim() ?? "";
  const active =
    linkedStudents.find((student) => student.id === preferred) ??
    linkedStudents[0] ??
    null;
  return { linkedStudents, active };
}

export async function linkParentToStudent(
  parentUserId: string,
  studentUserId: string,
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO parent_students (parent_user_id, student_user_id)
    VALUES (${parentUserId}::uuid, ${studentUserId}::uuid)
    ON CONFLICT (parent_user_id, student_user_id) DO NOTHING
  `;
}

export async function assertLinkableStudent(
  studentUserId: string,
  parentUserId?: string,
): Promise<void> {
  if (!studentUserId || !STUDENT_ID_RE.test(studentUserId)) {
    throw new Error("PARENT_STUDENT_REQUIRED");
  }
  if (parentUserId && parentUserId === studentUserId) {
    throw new Error("PARENT_STUDENT_REQUIRED");
  }
  const student = await findUserById(studentUserId);
  if (!student || student.role !== "student") {
    throw new Error("PARENT_STUDENT_REQUIRED");
  }
}

export async function assertLinkableStudents(
  studentUserIds: string[],
  parentUserId?: string,
): Promise<string[]> {
  const unique = [
    ...new Set(studentUserIds.map((id) => id.trim()).filter(Boolean)),
  ];
  if (unique.length === 0) {
    throw new Error("PARENT_STUDENT_REQUIRED");
  }
  for (const studentUserId of unique) {
    await assertLinkableStudent(studentUserId, parentUserId);
  }
  return unique;
}

export async function clearLinksForStudent(studentUserId: string): Promise<void> {
  const sql = getDb();
  await sql`
    DELETE FROM parent_students
    WHERE student_user_id = ${studentUserId}::uuid
  `;
}

/** Replace this parent's student links with the given set (one or more). */
export async function setParentStudentLinks(
  parentUserId: string,
  studentUserIds: string[],
): Promise<void> {
  const unique = await assertLinkableStudents(studentUserIds, parentUserId);
  const sql = getDb();
  await sql`
    DELETE FROM parent_students
    WHERE parent_user_id = ${parentUserId}::uuid
  `;
  for (const studentUserId of unique) {
    await linkParentToStudent(parentUserId, studentUserId);
  }
}

export async function clearParentStudentLinks(parentUserId: string): Promise<void> {
  const sql = getDb();
  await sql`
    DELETE FROM parent_students
    WHERE parent_user_id = ${parentUserId}::uuid
  `;
}

export async function createParentForStudent(input: {
  name: string;
  email: string;
  password: string;
  studentIds: string[];
}) {
  const studentIds = await assertLinkableStudents(input.studentIds);
  const parent = await createUser({
    name: input.name,
    email: input.email,
    password: input.password,
    role: "parent",
  });
  await setParentStudentLinks(parent.id, studentIds);
  return parent;
}

export async function listParentsForStudent(
  studentUserId: string,
): Promise<{ id: string; email: string; name: string }[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT p.id, p.email, p.name
    FROM parent_students ps
    INNER JOIN users p ON p.id = ps.parent_user_id
    WHERE ps.student_user_id = ${studentUserId}::uuid
      AND p.active = true
      AND p.role = 'parent'
    ORDER BY p.email ASC
  `) as { id: string; email: string; name: string }[];
  return rows;
}
