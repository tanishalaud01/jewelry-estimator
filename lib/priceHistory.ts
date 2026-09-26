import type { SupabaseClient } from "@supabase/supabase-js";
import type { Metal, PriceIndexSnapshot } from "@/lib/priceIndex";

export type PriceHistoryPoint = {
  pricePerGram: number;
  source: "live" | "fallback";
  asOf: string;
};

export type PriceHistory = Record<Metal, PriceHistoryPoint[]>;

const METALS: Metal[] = ["gold", "silver", "platinum"];

/**
 * Best-effort: the price_index_snapshots table only exists once the SQL
 * migration has been run against this Supabase project, and inserts only
 * succeed for an authenticated request (see the table's RLS policy). Either
 * way, a failure here must never break the price-index response.
 */
export async function recordPriceIndexSnapshot(
  supabase: SupabaseClient,
  snapshot: PriceIndexSnapshot
) {
  try {
    await supabase.from("price_index_snapshots").insert(
      METALS.map((metal) => ({
        metal,
        price_per_gram: snapshot.prices[metal].pricePerGram,
        price_per_troy_ounce: snapshot.prices[metal].pricePerTroyOunce,
        source: snapshot.prices[metal].source,
        as_of: snapshot.prices[metal].asOf,
      }))
    );
  } catch {
    // Table not migrated yet, or the request was unauthenticated. Non-fatal.
  }
}

export async function getPriceHistory(
  supabase: SupabaseClient,
  limitPerMetal = 60
): Promise<PriceHistory> {
  const empty: PriceHistory = { gold: [], silver: [], platinum: [] };

  try {
    const { data, error } = await supabase
      .from("price_index_snapshots")
      .select("metal, price_per_gram, source, as_of")
      .order("as_of", { ascending: false })
      .limit(limitPerMetal * METALS.length);

    if (error || !data) return empty;

    const history = { ...empty };
    for (const metal of METALS) {
      history[metal] = data
        .filter((row) => row.metal === metal)
        .slice(0, limitPerMetal)
        .reverse()
        .map((row) => ({
          pricePerGram: Number(row.price_per_gram),
          source: row.source,
          asOf: row.as_of,
        }));
    }
    return history;
  } catch {
    return empty;
  }
}
