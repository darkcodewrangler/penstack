import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { checkPermission } from "@/src/lib/auth/check-permission";
import { getSession } from "@/src/lib/auth/next-auth";
import { PostSelect } from "@/src/types";
import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// export const revalidate = 3600; // revalidate every hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const search = searchParams.get("search");
  const access = searchParams.get("access");

  const session = await getSession();
  const status =
    (searchParams.get("status") as NonNullable<PostSelect["status"] | "all">) ||
    "published";
  const sortBy =
    (searchParams.get("sortBy") as "recent" | "published_at" | "popular") ||
    "recent";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const category = searchParams.get("category");
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [];
  if (search) {
    whereConditions.push(ilike(posts.title, `%${search}%`));
    whereConditions.push(ilike(posts.content, `%${search}%`));
  }
  if (status && status !== "all") {
    whereConditions.push(eq(posts.status, status));
  }
  if (access === "dashboard" && session?.user?.role_id !== 1) {
    whereConditions.push(eq(posts.author_id, session?.user?.id as string));
  }
  if (category) {
    whereConditions.push(
      sql`EXISTS (
          SELECT 1 FROM categories 
          WHERE categories.id = ${posts.category_id} 
          AND categories.name ILIKE ${`%${category}%`}
        )`
    );
  }
  try {
    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })

      .from(posts)
      .where(and(...whereConditions));
    const total = Number(totalResult[0].count);

    let orderBy;
    const popularOrderSql = sql`(SELECT COUNT(*) FROM PostViews WHERE post_id = ${posts.id})`;
    switch (sortBy) {
      case "recent":
        orderBy = [desc(posts.created_at), desc(posts.is_sticky)];
        break;
      case "popular":
        orderBy = [
          sortOrder === "desc" ? desc(popularOrderSql) : asc(popularOrderSql),
          desc(posts.is_sticky),
        ];
        break;
      default:
        orderBy = [
          sortOrder === "desc" ? desc(posts[sortBy]) : asc(posts[sortBy]),
          desc(posts.is_sticky),
        ];
        break;
    }
    const _posts = await db.query.posts.findMany({
      limit,
      offset,
      orderBy,
      where: whereConditions?.length > 0 ? and(...whereConditions) : undefined,
      with: {
        views: {
          columns: { id: true },
        },
        featured_image: {
          columns: {
            url: true,
            alt_text: true,
            caption: true,
          },
        },
        category: {
          columns: {
            name: true,
            slug: true,
            id: true,
          },
        },
        author: {
          columns: { auth_id: true, name: true, avatar: true, username: true },
        },
      },
    });

    const transformedPosts = _posts.map((post) => {
      const { views, ...postWithoutViews } = post;
      const viewsCount = views.length;
      return {
        ...postWithoutViews,
        views: { count: viewsCount },
      };
    });

    return NextResponse.json({
      data: transformedPosts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: "All posts fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        error: error?.message,
        message: "Something went wrong... could not fetch posts",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  await checkPermission({ requiredPermission: "posts:create" }, async () => {
    const {
      title,
      content,
      summary,
      slug,
      featured_image_id,
      status,
      author_id,
      visibility,
      category_id,
      post_id,
    } = await req.json();

    try {
      const post = await db.transaction(async (tx) => {
        const [insertResponse] = await tx
          .insert(posts)
          .values({
            title,
            content,
            summary,
            slug,
            featured_image_id,
            author_id,
            status,
            visibility,
            category_id,
          })
          .$returningId();
        return await tx.query.posts.findFirst({
          where: eq(posts.id, insertResponse.id),
        });
      });

      return NextResponse.json({
        data: post,
        message: "Post created successfully",
      });
    } catch (error: any) {
      return NextResponse.json({
        data: null,
        error: error?.message,
        message: "Error creating post",
      });
    }
  });
}
