"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="text-sm font-medium text-ink">
          관리자 비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-sale" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "확인 중..." : "로그인"}
      </button>
    </form>
  );
}
