"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">
            Password updated
          </h1>
          <p className="mt-3 text-sm text-muted">
            Your password has been changed.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">
            Reset link needed
          </h1>
          <p className="mt-3 text-sm text-muted">
            Open this page from the password reset link in your email. If
            it&rsquo;s expired, request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
          >
            Request a new link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm"
      >
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-wide text-muted transition hover:text-accent"
        >
          Jewelry Value Estimator
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Set a new password
        </h1>

        {error && (
          <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-muted">
          New password
        </label>
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <label className="mt-4 block text-sm font-medium text-muted">
          Confirm new password
        </label>
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
