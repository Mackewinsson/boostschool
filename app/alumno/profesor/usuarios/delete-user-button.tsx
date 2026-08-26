"use client";

import { AdminButton } from "@/components/admin/admin-button";
import { deleteManagedUserAction } from "./actions";

type DeleteUserButtonProps = {
  userId: string;
  label: string;
  confirmMessage: string;
};

export function DeleteUserButton({
  userId,
  label,
  confirmMessage,
}: DeleteUserButtonProps) {
  return (
    <form
      action={deleteManagedUserAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={userId} />
      <AdminButton type="submit" variant="danger">
        {label}
      </AdminButton>
    </form>
  );
}
