export type EstimateInput = {
  jewelryType: string;
  metal: string;
  purity: string;
  weightGrams: number;
  gemstone: string;
  gemstoneCarat: number;
  condition: string;
  brandTier: string;
};

const purityMultipliers: Record<string, number> = {
  "10k": 0.417,
  "14k": 0.585,
  "18k": 0.75,
  "22k": 0.917,
  "24k": 1,
  sterling: 0.925,
  pure: 1,
};

const gemstonePrices: Record<string, number> = {
  none: 0,
  diamond: 1200,
  ruby: 800,
  sapphire: 600,
  emerald: 700,
};

const conditionMultipliers: Record<string, number> = {
  poor: 0.55,
  fair: 0.7,
  good: 0.85,
  excellent: 1,
};

const brandMultipliers: Record<string, number> = {
  generic: 1,
  known: 1.2,
  luxury: 1.6,
};

/**
 * metalPricePerGram comes from the live price index (see lib/priceIndex.ts)
 * rather than being looked up here, so the benchmark price and the
 * valuation formula that consumes it stay separate concerns.
 */
export function estimateJewelryValue(
  input: EstimateInput,
  metalPricePerGram: number
) {
  const metalValue =
    input.weightGrams * metalPricePerGram * purityMultipliers[input.purity];

  const gemstoneValue = input.gemstoneCarat * gemstonePrices[input.gemstone];

  const subtotal = metalValue + gemstoneValue;

  const estimatedValue =
    subtotal *
    conditionMultipliers[input.condition] *
    brandMultipliers[input.brandTier];

  return {
    metalValue: Math.round(metalValue * 100) / 100,
    gemstoneValue: Math.round(gemstoneValue * 100) / 100,
    estimatedValue: Math.round(estimatedValue * 100) / 100,
  };
}
