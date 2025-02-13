import { NextRequest, NextResponse } from "next/server";
import { getAggregatedPostViews } from "@/src/lib/queries/aggregated-post-views";
import { AggregatedPostViews } from "@/src/types";
import {
  addDays,
  subDays,
  startOfYear,
  endOfYear,
  subYears,
  startOfMonth,
  endOfMonth,
} from "date-fns";

type TimeRange = "7" | "30" | "current_year" | "all";
type AggregationType = "daily" | "monthly" | "yearly";

interface DateConfig {
  startDate: Date;
  endDate: Date;
  aggregationType: AggregationType;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const timeRange = (searchParams.get("timeRange") as TimeRange) || "all";
    const { startDate, endDate, aggregationType } = getDateConfig(timeRange);

    // Query for views with appropriate aggregation
    const viewsData = await getAggregatedPostViews(
      startDate,
      endDate,
      undefined,
      aggregationType
    );

    return NextResponse.json(
      {
        data: fillMissingPeriods(
          viewsData,
          startDate,
          endDate,
          aggregationType
        ),
        timeRange,
        aggregationType,
        message: "Post views fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching post views:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve post views",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

function getDateConfig(timeRange: TimeRange): DateConfig {
  const now = new Date();

  switch (timeRange) {
    case "7":
      return {
        startDate: subDays(now, 7),
        endDate: now,
        aggregationType: "daily",
      };
    case "30":
      return {
        startDate: subDays(now, 30),
        endDate: now,
        aggregationType: "daily",
      };
    case "current_year":
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
        aggregationType: "monthly",
      };
    case "all":
      return {
        startDate: startOfYear(subYears(now, 4)), // Last 5 years
        endDate: now,
        aggregationType: "yearly",
      };
    default:
      return {
        startDate: subDays(now, 7),
        endDate: now,
        aggregationType: "daily",
      };
  }
}

function fillMissingPeriods(
  data: AggregatedPostViews[],
  startDate: Date,
  endDate: Date,
  aggregationType: AggregationType
): AggregatedPostViews[] {
  const filledData: AggregatedPostViews[] = [];
  let currentDate = new Date(startDate);
  const dateMap = new Map(
    data.map((item) => [
      item.viewed_date,
      {
        total_views: item.total_views,
        unique_views: item.unique_views,
        registered_user_views: item.registered_user_views,
        anonymous_views: item.anonymous_views,
      },
    ])
  );

  while (currentDate <= endDate) {
    let dateStr: string;
    let nextDate: Date;

    switch (aggregationType) {
      case "daily":
        dateStr = currentDate.toISOString().slice(0, 10);
        nextDate = addDays(currentDate, 1);
        break;
      case "monthly":
        dateStr = currentDate.toISOString().slice(0, 7);
        nextDate = endOfMonth(currentDate);
        currentDate = startOfMonth(addDays(nextDate, 1));
        break;
      case "yearly":
        dateStr = currentDate.toISOString().slice(0, 4);
        nextDate = endOfYear(currentDate);
        currentDate = startOfYear(addDays(nextDate, 1));
        break;
      default:
        throw new Error(`Invalid aggregation type: ${aggregationType}`);
    }

    filledData.push({
      viewed_date: dateStr,
      total_views: dateMap.get(dateStr)?.total_views || 0,
      unique_views: dateMap.get(dateStr)?.unique_views || 0,
      registered_user_views: dateMap.get(dateStr)?.registered_user_views || 0,
      anonymous_views: dateMap.get(dateStr)?.anonymous_views || 0,
    });

    if (aggregationType === "daily") {
      currentDate = nextDate;
    }
  }

  return filledData;
}
