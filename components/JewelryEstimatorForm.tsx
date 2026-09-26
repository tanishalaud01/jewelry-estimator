"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { estimateJewelryValue } from "@/lib/estimateJewelryValue";
import type { Metal, PriceIndexSnapshot } from "@/lib/priceIndex";
import { useRouter } from "next/navigation";

const inputClassName =
  "mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-foreground shadow-sm placeholder:text-muted transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const fieldHeightStyle = { height: "2.75rem" };
const labelClassName = "block text-sm font-medium text-muted";

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="relative mt-2">
        <select
          className="h-11 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 text-foreground shadow-sm transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          style={fieldHeightStyle}
          value={value}
          onChange={onChange}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          width={16}
          height={16}
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <path
            d="M5.5 7.5L10 12l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function JewelryEstimatorForm() {
  const router = useRouter();
  const supabase = createClient();

  const [jewelryType, setJewelryType] = useState("ring");
  const [metal, setMetal] = useState<Metal>("gold");
  const [purity, setPurity] = useState("14k");
  const [weightGrams, setWeightGrams] = useState(5);
  const [gemstone, setGemstone] = useState("diamond");
  const [gemstoneCarat, setGemstoneCarat] = useState(1);
  const [condition, setCondition] = useState("good");
  const [brandTier, setBrandTier] = useState("generic");

  const [priceIndex, setPriceIndex] = useState<PriceIndexSnapshot | null>(
    null
  );
  const [priceIndexError, setPriceIndexError] = useState<string | null>(
    null
  );

  const [result, setResult] = useState<{
    metalValue: number;
    gemstoneValue: number;
    estimatedValue: number;
    metalPriceUsed: number;
    metalPriceSource: "live" | "fallback";
    metalPriceAsOf: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/price-index")
      .then((response) => response.json())
      .then((data: PriceIndexSnapshot) => {
        if (!cancelled) setPriceIndex(data);
      })
      .catch(() => {
        if (!cancelled) {
          setPriceIndexError("Couldn't load the live price index.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!priceIndex) return;

    const metalPrice = priceIndex.prices[metal];

    const estimate = estimateJewelryValue(
      {
        jewelryType,
        metal,
        purity,
        weightGrams,
        gemstone,
        gemstoneCarat,
        condition,
        brandTier,
      },
      metalPrice.pricePerGram
    );

    setResult({
      ...estimate,
      metalPriceUsed: metalPrice.pricePerGram,
      metalPriceSource: metalPrice.source,
      metalPriceAsOf: metalPrice.asOf,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("valuations").insert({
      user_id: user.id,
      jewelry_type: jewelryType,
      metal,
      purity,
      weight_grams: weightGrams,
      gemstone,
      gemstone_carat: gemstoneCarat,
      condition,
      brand_tier: brandTier,
      metal_value: estimate.metalValue,
      gemstone_value: estimate.gemstoneValue,
      estimated_value: estimate.estimatedValue,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">
        Estimate jewelry value
      </h2>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Live metal price index
          </h3>
          {priceIndex && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  Object.values(priceIndex.prices).some(
                    (p) => p.source === "live"
                  )
                    ? "bg-positive"
                    : "bg-warning"
                }`}
              />
              {Object.values(priceIndex.prices).every(
                (p) => p.source === "live"
              )
                ? "live"
                : "partial fallback"}
            </span>
          )}
        </div>

        {priceIndex ? (
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {(["gold", "silver", "platinum"] as const).map((m) => {
              const point = priceIndex.prices[m];
              const isSelected = m === metal;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetal(m)}
                  className={`px-4 py-3 text-left transition ${
                    isSelected ? "bg-surface-muted" : "hover:bg-surface-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-foreground">
                      {m}
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
                  <div className="mt-1 font-tabular text-xl font-semibold text-foreground">
                    ${point.pricePerGram.toFixed(2)}
                    <span className="ml-1 text-xs font-normal text-muted">
                      /g
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    as of {new Date(point.asOf).toLocaleTimeString()}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="px-4 py-4 text-sm text-muted">
            {priceIndexError ?? "Loading live prices…"}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <SelectField
          label="Jewelry type"
          value={jewelryType}
          onChange={(event) => setJewelryType(event.target.value)}
        >
          <option value="ring">Ring</option>
          <option value="necklace">Necklace</option>
          <option value="bracelet">Bracelet</option>
          <option value="earrings">Earrings</option>
        </SelectField>

        <SelectField
          label="Metal"
          value={metal}
          onChange={(event) => setMetal(event.target.value as Metal)}
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
        </SelectField>

        <SelectField
          label="Purity"
          value={purity}
          onChange={(event) => setPurity(event.target.value)}
        >
          <option value="10k">10k</option>
          <option value="14k">14k</option>
          <option value="18k">18k</option>
          <option value="22k">22k</option>
          <option value="24k">24k</option>
          <option value="sterling">Sterling Silver</option>
          <option value="pure">Pure</option>
        </SelectField>

        <div>
          <label className={labelClassName}>Weight in grams</label>
          <input
            className={inputClassName}
            style={fieldHeightStyle}
            type="number"
            min="0"
            step="0.1"
            value={weightGrams}
            onChange={(event) => setWeightGrams(Number(event.target.value))}
          />
        </div>

        <SelectField
          label="Gemstone"
          value={gemstone}
          onChange={(event) => setGemstone(event.target.value)}
        >
          <option value="none">None</option>
          <option value="diamond">Diamond</option>
          <option value="ruby">Ruby</option>
          <option value="sapphire">Sapphire</option>
          <option value="emerald">Emerald</option>
        </SelectField>

        <div>
          <label className={labelClassName}>Gemstone carats</label>
          <input
            className={inputClassName}
            style={fieldHeightStyle}
            type="number"
            min="0"
            step="0.1"
            value={gemstoneCarat}
            onChange={(event) => setGemstoneCarat(Number(event.target.value))}
          />
        </div>

        <SelectField
          label="Condition"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
        >
          <option value="poor">Poor</option>
          <option value="fair">Fair</option>
          <option value="good">Good</option>
          <option value="excellent">Excellent</option>
        </SelectField>

        <SelectField
          label="Brand tier"
          value={brandTier}
          onChange={(event) => setBrandTier(event.target.value)}
        >
          <option value="generic">Generic</option>
          <option value="known">Known brand</option>
          <option value="luxury">Luxury brand</option>
        </SelectField>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={!priceIndex}
            className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            Calculate estimate
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <div className="bg-surface-muted px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Estimated value
            </p>
            <p className="mt-1 font-tabular text-3xl font-semibold text-accent">
              ${result.estimatedValue.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1.5 px-5 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Metal value</span>
              <span className="font-tabular text-foreground">
                ${result.metalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Gemstone value</span>
              <span className="font-tabular text-foreground">
                ${result.gemstoneValue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t border-border px-5 py-3">
            <p className="text-xs text-muted">
              Priced against {metal} at{" "}
              <span className="font-tabular">
                ${result.metalPriceUsed.toFixed(2)}/g
              </span>{" "}
              ({result.metalPriceSource}, as of{" "}
              {new Date(result.metalPriceAsOf).toLocaleString()})
            </p>
            <p className="mt-2 text-xs text-muted">
              This is a simplified estimate and not a certified appraisal.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
