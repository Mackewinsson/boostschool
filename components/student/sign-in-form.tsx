"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import type { StudentContent } from "@/lib/student-content/types";

const initialState: LoginState = {};

type SignInFormProps = {
  copy: StudentContent["portal"];
};

const inputClassName =
  "mt-1 w-full rounded-xl border border-border bg-canvas-up px-3 py-2.5 text-base text-fg outline-none transition focus:border-accent md:text-sm";

export function SignInForm({ copy }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-canvas-up p-6 shadow-xl shadow-black/10">
      {state.error ? (
        <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {copy.signInError}
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium text-fg">{copy.emailLabel}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClassName}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-fg">{copy.passwordLabel}</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className={inputClassName}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? copy.signInButton : copy.signInButton}
      </button>
    </form>
  );
}
