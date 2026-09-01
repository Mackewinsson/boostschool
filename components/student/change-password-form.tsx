"use client";

import { useActionState } from "react";
import {
  changeOwnPasswordAction,
  type ChangePasswordState,
} from "@/lib/actions/auth";
import type { StudentContent } from "@/lib/student-content/types";

const initialState: ChangePasswordState = {};

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-border bg-canvas px-3 py-2.5 text-base text-fg outline-none transition focus:border-accent/50 md:text-sm";

type ChangePasswordFormProps = {
  copy: StudentContent["portal"];
};

function errorMessage(
  error: ChangePasswordState["error"],
  copy: StudentContent["portal"],
): string | null {
  if (error === "current") return copy.accountErrorCurrent;
  if (error === "short") return copy.accountErrorShort;
  if (error === "mismatch") return copy.accountErrorMismatch;
  if (error === "same") return copy.accountErrorSame;
  if (error === "generic") return copy.accountErrorGeneric;
  return null;
}

export function ChangePasswordForm({ copy }: ChangePasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    changeOwnPasswordAction,
    initialState,
  );
  const message = errorMessage(state.error, copy);

  return (
    <form
      key={state.saved ? "saved" : state.error ?? "idle"}
      action={formAction}
      className="mt-6 max-w-md space-y-4"
      data-testid="own-password-form"
    >
      {state.saved ? (
        <p
          className="rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-sm text-accent"
          data-testid="own-password-success"
        >
          {copy.accountUpdated}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {message}
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium text-fg">{copy.accountCurrentLabel}</span>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClassName}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-fg">{copy.accountNewLabel}</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClassName}
        />
        <span className="mt-1.5 block text-xs text-fg-muted">
          {copy.accountMinHint}
        </span>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-fg">{copy.accountConfirmLabel}</span>
        <input
          name="passwordConfirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClassName}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
      >
        {copy.accountSaveButton}
      </button>
    </form>
  );
}
