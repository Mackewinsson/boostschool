import { getDb } from "@/lib/db/client";
import { createUser } from "./users";

type ParentStudentRow = {
  student_user_id: string;
  student_name: string;
};

export async function getLinkedStudentForParent(
  parentUserId: string,
): Promise<{ id: string; name: string } | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT ps.student_user_id, u.name AS student_name
    FROM parent_students ps
    INNER JOIN users u ON u.id = ps.student_user_id
    WHERE ps.parent_user_id = ${parentUserId}::uuid
    LIMIT 1
  `) as ParentStudentRow[];

  if (!rows[0]) {
    return null;
  }

  return {
    id: rows[0].student_user_id,
    name: rows[0].student_name,
  };
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

/** Replace any existing parent→student links with a single student. */
export async function setParentStudentLink(
  parentUserId: string,
  studentUserId: string,
): Promise<void> {
  const sql = getDb();
  await sql`
    DELETE FROM parent_students
    WHERE parent_user_id = ${parentUserId}::uuid
  `;
  await sql`
    INSERT INTO parent_students (parent_user_id, student_user_id)
    VALUES (${parentUserId}::uuid, ${studentUserId}::uuid)
  `;
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
  studentId: string;
}) {
  const parent = await createUser({
    name: input.name,
    email: input.email,
    password: input.password,
    role: "parent",
  });
  await linkParentToStudent(parent.id, input.studentId);
  return parent;
}
