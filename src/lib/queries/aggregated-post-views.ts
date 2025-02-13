import "server-only";
import { db } from "@/src/db";
import { and, between, eq, sql } from "drizzle-orm";
import { postViews } from "@/src/db/schemas/posts-analytics.sql";
import { AggregatedPostViews } from "@/src/types";
import { format } from "date-fns";

export const getAggregatedPostViews = async (
  startDate: Date,
  endDate: Date,
  postId?: number,
  aggregationType: "daily" | "monthly" | "yearly" = "daily"
) => {
  // Define the date expression based on aggregation type
  let dateExpr;
  let groupByExpr;
  let _startDate: string | Date = startDate;
  let _endDate: string | Date = endDate;
  switch (aggregationType) {
    case "daily":
      dateExpr = sql<string>`DATE(${postViews.viewed_at})`;
      groupByExpr = sql<string>`DATE(${postViews.viewed_at})`;

      break;
    case "monthly":
      dateExpr = sql<string>`DATE_FORMAT(${postViews.viewed_at}, '%Y-%m-01')`;
      groupByExpr = sql<string>`DATE_FORMAT(${postViews.viewed_at}, '%Y-%m') `;
      _startDate = format(startDate, "yyyy-") + "01";
      break;
    case "yearly":
      dateExpr = sql<string>`DATE_FORMAT(${postViews.viewed_at}, '%Y-01-01') `;
      groupByExpr = sql<string>`DATE_FORMAT(${postViews.viewed_at}, '%Y')`;
      _startDate = format(startDate, "yyyy");
      break;
  }

  // const query = db
  //   .select({
  //     viewed_date: dateExpr,
  //     total_views: sql<number>`count(*)`,
  //     unique_views: sql<number>`count(distinct case
  //       when ${postViews.user_id} is not null then ${postViews.user_id}
  //       else concat(${postViews.ip_address}, ${postViews.user_agent})
  //     end)`,
  //     registered_user_views: sql<number>`count(distinct ${postViews.user_id})`,
  //     anonymous_views: sql<number>`sum(case when ${postViews.user_id} is null then 1 else 0 end)`,
  //   })
  //   .from(postViews)
  //   .where(
  //     and(
  //       postId ? eq(postViews.post_id, postId) : undefined,
  //       between(dateExpr, _startDate, endDate || new Date())
  //     )
  //   )
  //   .groupBy(groupByExpr);

  // console.log({ query: query });

  // // .orderBy(groupByExpr);
  // // return [];
  // const data = await query;
  // return mergeViewsByPeriod(data, aggregationType);
  const query = await db.execute(sql`WITH date_filters AS (
  SELECT
    CASE 
      WHEN :filter_type = 'daily' THEN DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      WHEN :filter_type = 'monthly' THEN DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      WHEN :filter_type = 'quarterly' THEN DATE_SUB(CURDATE(), INTERVAL 90 DAY)
      WHEN :filter_type = 'yearly' THEN DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
      WHEN :filter_type = 'custom' THEN :start_date
    END AS start_date,
    CASE 
      WHEN :filter_type = 'custom' THEN :end_date
      ELSE CURDATE()
    END AS end_date
),
time_series AS (
  SELECT 
    CASE 
      WHEN :filter_type IN ('daily', 'monthly') THEN date_series
      WHEN :filter_type = 'quarterly' THEN STR_TO_DATE(CONCAT(YEARWEEK(date_series), ' Sunday'), '%X%V %W')
      WHEN :filter_type = 'yearly' THEN DATE_FORMAT(date_series, '%Y-01-01')
      WHEN :filter_type = 'custom' THEN date_series
    END AS period_start,
    CASE 
      WHEN :filter_type IN ('daily', 'monthly') THEN DATE_ADD(date_series, INTERVAL 1 DAY)
      WHEN :filter_type = 'quarterly' THEN DATE_ADD(STR_TO_DATE(CONCAT(YEARWEEK(date_series), ' Sunday'), '%X%V %W'), INTERVAL 1 WEEK)
      WHEN :filter_type = 'yearly' THEN DATE_FORMAT(DATE_ADD(date_series, INTERVAL 1 YEAR), '%Y-01-01')
      WHEN :filter_type = 'custom' THEN DATE_ADD(date_series, INTERVAL 1 DAY)
    END AS period_end
  FROM (
    SELECT DATE(viewed_at) AS date_series
    FROM PostViews
    WHERE viewed_at >= (SELECT start_date FROM date_filters)
      AND viewed_at < (SELECT end_date FROM date_filters)
    GROUP BY DATE(viewed_at)
  ) dates
),
metrics AS (
  SELECT 
    ts.period_start,
    COUNT(*) AS total_views,
    COUNT(CASE WHEN pv.user_id IS NOT NULL THEN 1 END) AS registered_users_views,
    COUNT(CASE WHEN pv.user_id IS NULL THEN 1 END) AS anonymous_views,
    COUNT(DISTINCT COALESCE(pv.user_id, CONCAT(pv.ip_address, pv.user_agent))) AS unique_views
  FROM time_series ts
  LEFT JOIN PostViews pv ON 
    pv.viewed_at >= ts.period_start AND 
    pv.viewed_at < ts.period_end
  GROUP BY ts.period_start
  ORDER BY ts.period_start
)
SELECT 
  CASE 
    WHEN :filter_type IN ('daily', 'monthly') THEN DATE_FORMAT(period_start, '%Y-%m-%d')
    WHEN :filter_type = 'quarterly' THEN CONCAT('Week ', WEEK(period_start))
    WHEN :filter_type = 'yearly' THEN YEAR(period_start)
    WHEN :filter_type = 'custom' THEN DATE_FORMAT(period_start, '%Y-%m-%d')
  END AS period,
  total_views,
  registered_users_views,
  anonymous_views,
  unique_views
FROM metrics;`);
  console.log({ query });
  return [];
};

function mergeViewsByPeriod(
  data: AggregatedPostViews[],
  aggregationType: "daily" | "monthly" | "yearly"
): AggregatedPostViews[] {
  if (data.length === 0) return [];

  return Object.values(
    data.reduce((acc: Record<string, AggregatedPostViews>, item) => {
      let date;
      switch (aggregationType) {
        case "daily":
          date = new Date(item.viewed_date).toISOString().split("T")[0];
          break;
        case "monthly":
          date = item.viewed_date.substring(0, 7); // YYYY-MM
          break;
        case "yearly":
          date = item.viewed_date.substring(0, 4); // YYYY
          break;
      }

      if (!acc[date]) {
        acc[date] = {
          ...item,
          viewed_date: date,
          anonymous_views: Number(item.anonymous_views),
        };
      } else {
        acc[date].total_views += item.total_views;
        acc[date].unique_views += item.unique_views;
        acc[date].registered_user_views += item.registered_user_views;
        acc[date].anonymous_views += Number(item.anonymous_views);
      }
      return acc;
    }, {})
  );
}
