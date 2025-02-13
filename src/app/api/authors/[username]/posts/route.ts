import { db } from "@/src/db";
import { posts, users } from "@/src/db/schemas";
import { PostSelect } from "@/src/types";
import { getServerSearchParams } from "@/src/utils";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const searchParams = getServerSearchParams<{
    status: NonNullable<PostSelect["status"]> | "all";
    limit: number;
    page: number;
  }>(req);
  const { username } = params;
  try {
    const { status = "published", limit = 10, page = 1 } = searchParams;
    if (!username)
      return NextResponse.json(
        {
          data: null,
          message: "No 'username' provided",
        },
        { status: 400 }
      );

    const user = await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase()),
    });
    if (!user)
      return NextResponse.json(
        {
          data: null,
          message: "User not found",
        },
        { status: 404 }
      );

    const offset = limit * (page - 1);
    const _posts = await db.query.posts.findMany({
      where:
        status === "all"
          ? eq(posts.author_id, user?.auth_id as string)
          : eq(posts.status, status),
      offset: offset,
      limit: limit,
      orderBy: [desc(posts.updated_at), desc(posts?.published_at)],
      with: {
        featured_image: {
          columns: {
            url: true,
            caption: true,
            alt_text: true,
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
          columns: {
            name: true,
            avatar: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: _posts,
      message: "All posts fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message,
      data: null,
      message: "Something went wrong... could not fetch posts",
    });
  }
}
