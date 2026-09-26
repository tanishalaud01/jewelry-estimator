"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. You can now log in.");
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm"
      >
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-wide text-muted transition hover:text-accent"
        >
          Jewelry Value Estimator
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Create account
        </h1>

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

        <label className="mt-4 block text-sm font-medium text-muted">
          Password
        </label>
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
        >
          Sign up
        </button>

        <p className="mt-4 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}