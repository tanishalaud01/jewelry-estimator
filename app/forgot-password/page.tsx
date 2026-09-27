"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">
            Check your email
          </h1>
          <p className="mt-3 text-sm text-muted">
            If an account exists for <strong>{email}</strong>, a password
            reset link is on its way.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
          >
            Back to log in
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
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we&rsquo;ll send you a link to reset your
          password.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-muted">
          Email
        </label>
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send reset link"}
        </button>

        <p className="mt-4 text-sm text-muted">
          <Link href="/login" className="font-medium text-accent underline">
            Back to log in
          </Link>
        </p>
      </form>
    </main>
  );
}
