import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <Link
          href="/price-index"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted transition hover:text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-positive" />
          Live metal price index
        </Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Jewelry Value Estimator
        </h1>

        <p className="mx-auto mt-4 max-w-md text-balance text-muted">
          Estimate resale value from metal, weight, gemstone, condition, and
          brand tier — priced against a live gold, silver, and platinum spot
          index.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            Sign up
          </Link>
        </div>

        <Link
          href="/price-index"
          className="mt-4 inline-block text-sm text-muted underline transition hover:text-accent"
        >
          View the index →
        </Link>
      </div>
    </main>
  );
}
