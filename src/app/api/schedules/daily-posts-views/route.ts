import { NextRequest, NextResponse } from "next/server";
import { aggregatePostViews } from "@/src/lib/queries/aggregated-post-views";
import { db } from "@/src/db";

export async function POST(request: NextRequest) {
  try {
    try {
      await aggregatePostViews(db);
    } catch (error) {
      throw error;
    }
    return NextResponse.json({
      message: "Daily post views updated successfully",
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        message: "Failed: Error updating daily post views...",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
