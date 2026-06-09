"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { estimateJewelryValue } from "@/lib/estimateJewelryValue";
import { useRouter } from "next/navigation";

export default function JewelryEstimatorForm() {
  const router = useRouter();
  const supabase = createClient();

  const [jewelryType, setJewelryType] = useState("ring");
  const [metal, setMetal] = useState("gold");
  const [purity, setPurity] = useState("14k");
  const [weightGrams, setWeightGrams] = useState(5);
  const [gemstone, setGemstone] = useState("diamond");
  const [gemstoneCarat, setGemstoneCarat] = useState(1);
  const [condition, setCondition] = useState("good");
  const [brandTier, setBrandTier] = useState("generic");

  const [result, setResult] = useState<{
    metalValue: number;
    gemstoneValue: number;
    estimatedValue: number;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const estimate = estimateJewelryValue({
      jewelryType,
      metal,
      purity,
      weightGrams,
      gemstone,
      gemstoneCarat,
      condition,
      brandTier,
    });

    setResult(estimate);

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
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-900">
        Estimate jewelry value
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jewelry type
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={jewelryType}
            onChange={(event) => setJewelryType(event.target.value)}
          >
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bracelet">Bracelet</option>
            <option value="earrings">Earrings</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Metal
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={metal}
            onChange={(event) => setMetal(event.target.value)}
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purity
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
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
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight in grams
          </label>
          <input
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
            type="number"
            min="0"
            step="0.1"
            value={weightGrams}
            onChange={(event) => setWeightGrams(Number(event.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gemstone
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={gemstone}
            onChange={(event) => setGemstone(event.target.value)}
          >
            <option value="none">None</option>
            <option value="diamond">Diamond</option>
            <option value="ruby">Ruby</option>
            <option value="sapphire">Sapphire</option>
            <option value="emerald">Emerald</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gemstone carats
          </label>
          <input
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
            type="number"
            min="0"
            step="0.1"
            value={gemstoneCarat}
            onChange={(event) => setGemstoneCarat(Number(event.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
          >
            <option value="poor">Poor</option>
            <option value="fair">Fair</option>
            <option value="good">Good</option>
            <option value="excellent">Excellent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Brand tier
          </label>
          <select
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
            value={brandTier}
            onChange={(event) => setBrandTier(event.target.value)}
          >
            <option value="generic">Generic</option>
            <option value="known">Known brand</option>
            <option value="luxury">Luxury brand</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-black px-5 py-3 text-white"
          >
            Calculate estimate
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Estimated Value: ${result.estimatedValue}
          </h3>

          <p className="mt-2 text-gray-700">
            Metal value: ${result.metalValue}
          </p>

          <p className="text-gray-700">
            Gemstone value: ${result.gemstoneValue}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            This is a simplified estimate and not a certified appraisal.
          </p>
        </div>
      )}
    </section>
  );
}