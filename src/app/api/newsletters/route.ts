import { db } from "@/src/db";
import { newsletters } from "@/src/db/schemas";
import { NewsletterInsert } from "@/src/types";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const search = searchParams.get("search");
  const status = (searchParams.get("status") || "subscribed") as
    | NewsletterInsert["status"]
    | "all";
  const sortBy =
    (searchParams.get("sortBy") as "created_at" | "updated_at") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const offset = (page - 1) * limit;

  const whereConditions = [];
  if (search) {
    whereConditions.push(ilike(newsletters.email, `%${search}%`));
    whereConditions.push(ilike(newsletters.name, `%${search}%`));
  }
  if (status && status !== "all") {
    whereConditions.push(eq(newsletters.status, status));
  }

  try {
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsletters)
      .where(and(...whereConditions));
    const total = Number(totalResult[0].count);

    const orderBy = [
      sortOrder === "desc"
        ? desc(newsletters[sortBy])
        : asc(newsletters[sortBy]),
    ];

    const subscribers = await db.query.newsletters.findMany({
      limit,
      offset,
      orderBy,
      where: whereConditions?.length > 0 ? and(...whereConditions) : undefined,
    });

    return NextResponse.json({
      data: subscribers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: "Newsletter subscribers fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        error: error?.message,
        message: "Something went wrong... could not fetch subscribers",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      name,
      status,
      verification_status,
      verification_token,
      verification_token_expires,
    } = await req.json();

    const referrer = await headers().get("referer");
    // check if subscriber already exist and do nothing

    const alreadySubscribed = await db.query.newsletters.findFirst({
      where: eq(newsletters.email, email),
    });

    if (alreadySubscribed) {
      return NextResponse.json({
        data: null,
        message: "Already subscribed",
      });
    }

    await db.transaction(async (tx) => {
      await tx
        .insert(newsletters)
        .values({
          email,
          name,
          status,
          verification_status,
          verification_token,
          verification_token_expires,
          referrer,
        })
        .$returningId();
    });

    return NextResponse.json({
      data: null,
      message: "Newsletter subscription created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        error: error?.message,
        message: "Error creating newsletter subscription",
      },
      {
        status: 500,
      }
    );
  }
}
