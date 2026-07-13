import { NextResponse } from "next/server";
import { CATALOG, PRICING_SNAPSHOT_ID, PRICING_SNAPSHOT_DATE } from "../../../lib/providers";

// Canonical provider/model catalog + versioned pricing snapshot (blueprint §4.1/§6.3/§7.7).
// Open endpoint — the suite's source of truth for capabilities and list pricing.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    pricing_snapshot_id: PRICING_SNAPSHOT_ID,
    snapshot_date: PRICING_SNAPSHOT_DATE,
    count: CATALOG.length,
    models: CATALOG,
  });
}
