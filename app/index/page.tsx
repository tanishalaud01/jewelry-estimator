import Link from "next/link";
import { getMetalPriceIndex } from "@/lib/priceIndex";
import { getPriceHistory } from "@/lib/priceHistory";
import { createClient } from "@/lib/supabase/server";
import MetalTrendChart from "@/components/MetalTrendChart";

export default async function IndexPage() {
  const supabase = await createClient();

  const [priceIndex, history, userResult] = await Promise.all([
    getMetalPriceIndex(),
    getPriceHistory(supabase),
    supabase.auth.getUser(),
  ]);

  const isLoggedIn = Boolean(userResult.data.user);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-wide text-muted transition hover:text-accent"
          >
            Jewelry Value Estimator
          </Link>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            {isLoggedIn ? "Go to dashboard" : "Log in"}
          </Link>
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" />
            Live benchmark
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The Metal Price Index
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            A reference spot price for gold, silver, and platinum, sourced from
            live market quotes and converted to price-per-gram. Every valuation
            in the estimator is priced directly against this index — the index
            is the benchmark; the estimator is one product built on top of it.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {(["gold", "silver", "platinum"] as const).map((metal) => {
              const point = priceIndex.prices[metal];
              return (
                <div key={metal} className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-foreground">
                      {metal}
                    </span>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wide ${
                        point.source === "live"
                          ? "text-positive"
                          : "text-warning"
                      }`}
                    >
                      {point.source}
                    </span>
                  </div>
                  <div className="mt-2 font-tabular text-3xl font-semibold text-foreground">
                    ${point.pricePerGram.toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-muted">
                      /g
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    ${point.pricePerTroyOunce.toFixed(2)}/troy oz · as of{" "}
                    {new Date(point.asOf).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Price history
          </h2>
          <p className="mt-1 text-sm text-muted">
            Built from real snapshots this app has actually observed — every
            time a signed-in user opens the estimator, the live index is
            recorded. Nothing here is backfilled or simulated.
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-1">
            {(["gold", "silver", "platinum"] as const).map((metal) => (
              <div
                key={metal}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold capitalize text-foreground">
                  {metal}
                </h3>
                <div className="mt-3">
                  <MetalTrendChart
                    label={metal}
                    points={history[metal]}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-border bg-surface-muted p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Methodology
          </h2>
          <div className="mt-3 space-y-3 text-sm text-foreground">
            <p>
              <strong>Source.</strong> Spot prices for XAU (gold), XAG
              (silver), and XPT (platinum) are pulled from live market quotes
              at request time — not a listed or asking price, and not a fixed
              assumption.
            </p>
            <p>
              <strong>Conversion.</strong> Quotes arrive per troy ounce and are
              converted to price-per-gram (1 troy oz = 31.1034768 g) so they
              line up with how jewelry is weighed.
            </p>
            <p>
              <strong>Freshness.</strong> Each price is cached for 60 seconds,
              then re-fetched on the next request — close enough to real time
              for a valuation tool without hammering the upstream source.
            </p>
            <p>
              <strong>Fallback.</strong> If the live source is unreachable,
              each metal falls back independently to a static reference price,
              and is labeled <span className="text-warning">fallback</span>{" "}
              rather than silently passed off as live.
            </p>
            <p>
              <strong>History.</strong> Every request to the live index —
              triggered by real app usage — is logged as a snapshot. The chart
              above is that log, not a synthetic backfill.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
