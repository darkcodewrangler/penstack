import { db } from "@/src/db";
import { posts, postTags, tags } from "@/src/db/schemas/posts.sql";
import { getPlainPost } from "@/src/lib/queries/post";
import { and, eq, inArray, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;

    const post = await getPlainPost(slugOrPostId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postTagsList = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(tags)
      .innerJoin(postTags, eq(tags.id, postTags.tag_id))
      .where(eq(postTags.post_id, post.id));

    return NextResponse.json({
      data: postTagsList,
      message: "Post tags retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching post tags:", error);
    return NextResponse.json(
      { error: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;
    const { tagIds } = await request.json();

    if (!Array.isArray(tagIds)) {
      return NextResponse.json(
        { error: "tagIds must be an array" },
        { status: 400 }
      );
    }

    const post = await getPlainPost(slugOrPostId);

    if (!post) {
      return NextResponse.json(
        { data: null, message: "Post not found" },
        { status: 404 }
      );
    }

    const newPostTags = tagIds.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    }));

    await db.insert(postTags).values(newPostTags);

    return NextResponse.json({
      message: "Tags added to post successfully",
    });
  } catch (error) {
    console.error("Error adding tags to post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;
    const { tagIds } = await request.json();

    if (!Array.isArray(tagIds)) {
      return NextResponse.json(
        { error: "tagIds must be an array" },
        { status: 400 }
      );
    }

    const post = await getPlainPost(slugOrPostId);

    if (!post) {
      return NextResponse.json(
        { data: null, message: "Post not found" },
        { status: 404 }
      );
    }

    await db
      .delete(postTags)
      .where(
        and(eq(postTags.post_id, post.id), inArray(postTags.tag_id, tagIds))
      );

    return NextResponse.json({
      message: "Tags removed from post successfully",
    });
  } catch (error) {
    console.error("Error removing tags from post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
