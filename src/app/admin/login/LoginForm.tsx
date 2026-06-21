"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface/60 p-8 backdrop-blur"
      >
        <h1 className="font-serif text-2xl text-on-deep">Andaman Studio</h1>
        <p className="meta mb-7 text-on-deep/50">Admin sign in</p>

        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <label className="mb-4 block">
          <span className="meta mb-1.5 block text-on-deep/60">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-line bg-ink-deep px-3.5 py-2.5 text-sm text-on-deep outline-none focus:border-gold"
          />
        </label>

        <label className="mb-5 block">
          <span className="meta mb-1.5 block text-on-deep/60">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-line bg-ink-deep px-3.5 py-2.5 text-sm text-on-deep outline-none focus:border-gold"
          />
        </label>

        {state?.error && <p className="mb-4 text-sm text-[#e0633b]">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="font-syne w-full rounded-full bg-gold py-3 text-sm font-bold uppercase tracking-[0.1em] text-ink-deep transition-colors hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
