import { NextResponse } from "next/server";
import { getPriceHistory } from "@/lib/priceHistory";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const history = await getPriceHistory(supabase);

  return NextResponse.json(history);
}
