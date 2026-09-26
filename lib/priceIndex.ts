export type Metal = "gold" | "silver" | "platinum";

export type MetalPricePoint = {
  metal: Metal;
  symbol: string;
  pricePerGram: number;
  pricePerTroyOunce: number;
  currency: string;
  asOf: string;
  source: "live" | "fallback";
};

export type PriceIndexSnapshot = {
  generatedAt: string;
  prices: Record<Metal, MetalPricePoint>;
};

const TROY_OUNCE_IN_GRAMS = 31.1034768;

const METAL_SYMBOLS: Record<Metal, string> = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
};

// Last-resort reference prices, used only if the live index is unreachable.
const FALLBACK_PRICE_PER_GRAM: Record<Metal, number> = {
  gold: 70,
  silver: 0.9,
  platinum: 32,
};

async function fetchSpotPrice(metal: Metal): Promise<MetalPricePoint> {
  const symbol = METAL_SYMBOLS[metal];

  try {
    const response = await fetch(`https://api.gold-api.com/price/${symbol}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`gold-api returned ${response.status}`);
    }

    const data = await response.json();
    const pricePerTroyOunce = Number(data.price);

    if (!Number.isFinite(pricePerTroyOunce)) {
      throw new Error("gold-api returned a non-numeric price");
    }

    return {
      metal,
      symbol,
      pricePerGram: pricePerTroyOunce / TROY_OUNCE_IN_GRAMS,
      pricePerTroyOunce,
      currency: data.currency ?? "USD",
      asOf: data.updatedAt ?? new Date().toISOString(),
      source: "live",
    };
  } catch {
    const pricePerGram = FALLBACK_PRICE_PER_GRAM[metal];

    return {
      metal,
      symbol,
      pricePerGram,
      pricePerTroyOunce: pricePerGram * TROY_OUNCE_IN_GRAMS,
      currency: "USD",
      asOf: new Date().toISOString(),
      source: "fallback",
    };
  }
}

export async function getMetalPriceIndex(): Promise<PriceIndexSnapshot> {
  const [gold, silver, platinum] = await Promise.all(
    (["gold", "silver", "platinum"] as const).map(fetchSpotPrice)
  );

  return {
    generatedAt: new Date().toISOString(),
    prices: { gold, silver, platinum },
  };
}
