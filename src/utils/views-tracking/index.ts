import { and, eq, sql, gte } from "drizzle-orm";
import { db } from "../../db";
import {
  postViewAnalytics,
  postViews,
  activePostViewers,
  postViewStats,
} from "../../db/schemas";

const DUPLICATE_VIEW_WINDOW = 5 * 60; // 5 minutes in seconds

export const trackPostView = async ({
  postId,
  userId,
  ipAddress,
  userAgent,
  referrer,
  sessionId,
  deviceInfo,
  location,
  scrollDepth,
  timeSpent,
  entryPoint,
}: {
  postId: number;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
  scrollDepth: number;
  timeSpent: number;
  entryPoint?: string;
  deviceInfo: {
    type: string;
    browser?: string;
    os?: string;
  };
  location: {
    country: string;
    region: string;
    city: string;
  };
}) => {
  const now = new Date();
  const duplicateWindow = new Date(
    now.getTime() - DUPLICATE_VIEW_WINDOW * 1000
  );

  // Use a transaction for atomicity
  await db.transaction(async (tx) => {
    const recentView = await tx.query.postViews.findFirst({
      where: and(
        eq(postViews.post_id, postId),
        gte(postViews.viewed_at, duplicateWindow)
      ),
    });

    // If no recent view, insert a new view record
    if (!recentView) {
      await tx.insert(postViews).values({
        post_id: postId,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
      });
    }

    // Always update analytics for the session
    const existingAnalytics = await tx.query.postViewAnalytics.findFirst({
      where: and(
        eq(postViewAnalytics.post_id, postId),
        eq(postViewAnalytics.session_id, sessionId)
      ),
    });

    if (existingAnalytics) {
      // Update existing analytics with max values
      await tx
        .update(postViewAnalytics)
        .set({
          scroll_depth: sql`GREATEST(${scrollDepth}, scroll_depth)`,
          time_spent: sql`GREATEST(${timeSpent}, time_spent)`,
        })
        .where(eq(postViewAnalytics.id, existingAnalytics.id));
    } else {
      // Insert new analytics record
      await tx.insert(postViewAnalytics).values({
        post_id: postId,
        user_id: userId,
        session_id: sessionId,
        scroll_depth: scrollDepth,
        entry_point: entryPoint,
        time_spent: timeSpent,
        device_type: deviceInfo.type,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        country: location.country,
        region: location.region,
        city: location.city,
      });
    }

    // Update active viewers
    await tx
      .insert(activePostViewers)
      .values({
        post_id: postId,
        user_id: userId,
        session_id: sessionId,
      })
      .onDuplicateKeyUpdate({
        set: {
          last_active: sql`CURRENT_TIMESTAMP`,
        },
      });
  });
};

const updateDailyStats = async (postId: number) => {
  const today = new Date().toISOString().split("T")[0];

  const stats = (await db
    .select({
      totalViews: sql`COUNT(*)`,
      uniqueViews: sql`COUNT(DISTINCT user_id, ip_address)`,
      registeredViews: sql`COUNT(DISTINCT user_id) WHERE user_id IS NOT NULL`,
      anonymousViews: sql`COUNT(*) WHERE user_id IS NULL`,
    })
    .from(postViews)
    .where(
      and(eq(postViews.post_id, postId), sql`DATE(viewed_at) = ${today}`)
    )) as unknown as {
    totalViews: number;
    uniqueViews: number;
    registeredViews: number;
    anonymousViews: number;
  };

  await db
    .insert(postViewStats)
    .values({
      post_id: postId,
      view_date: new Date(today),
      total_views: stats.totalViews,
      unique_views: stats.uniqueViews,
      registered_user_views: stats.registeredViews,
      anonymous_views: stats.anonymousViews,
    })
    .onDuplicateKeyUpdate({
      set: {
        total_views: stats.totalViews,
        unique_views: stats.uniqueViews,
        registered_user_views: stats.registeredViews,
        anonymous_views: stats.anonymousViews,
      },
    });
};
