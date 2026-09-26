import { NextResponse } from "next/server";
import { getMetalPriceIndex } from "@/lib/priceIndex";
import { recordPriceIndexSnapshot } from "@/lib/priceHistory";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const index = await getMetalPriceIndex();

  const supabase = await createClient();
  await recordPriceIndexSnapshot(supabase, index);

  return NextResponse.json(index);
}
