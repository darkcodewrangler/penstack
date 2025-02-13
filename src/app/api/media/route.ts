import { NextResponse, NextRequest } from "next/server";
import { db } from "@/src/db";
import { medias } from "@/src/db/schemas";
import { and, like, desc, asc, eq, inArray, sql, ilike } from "drizzle-orm";
import { MediaType } from "@/src/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const folder = searchParams.get("folder");
    const sortBy =
      (searchParams.get("sortBy") as "created_at" | "name" | "size") ||
      "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    if (search) {
      whereConditions.push(ilike(medias.name, `%${search}%`));
    }
    if (type) {
      whereConditions.push(eq(medias.type, type as MediaType));
    }
    if (folder) {
      whereConditions.push(eq(medias.folder, folder));
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(medias)
      .where(and(...whereConditions));

    const total = Number(totalResult[0].count);

    // Get paginated results
    const results = await db
      .select()
      .from(medias)
      .where(and(...whereConditions))
      .orderBy(
        sortOrder === "desc" ? desc(medias[sortBy]) : asc(medias[sortBy])
      )
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
