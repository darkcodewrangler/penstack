import { db } from "@/src/db";
import { posts } from "@/src/db/schemas";
import { checkPermission } from "@/src/lib/auth/check-permission";
import { getSession } from "@/src/lib/auth/next-auth";
import { getPlainPost, getPost } from "@/src/lib/queries/post";
import { or, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  try {
    const { slugOrPostId } = params;

    const post = await getPost(slugOrPostId);

    if (!post)
      return NextResponse.json(
        { data: null, message: "Post not found" },
        { status: 404 }
      );

    return NextResponse.json({
      data: post,
      message: "Post retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: "Error retrieving post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  const { slugOrPostId } = params;
  const body = await req.json();
  const session = await getSession();
  const oldPost = await getPlainPost(slugOrPostId);
  return await checkPermission(
    {
      requiredPermission: "posts:edit",
      isOwner: oldPost?.author_id === session?.user?.id,
    },
    async () => {
      try {
        if (!oldPost)
          return NextResponse.json(
            {
              message: "Post not found",
            },
            { status: 404 }
          );

        await db
          .update(posts)
          .set({
            ...body,
            scheduled_at: body.scheduled_at
              ? new Date(body.scheduled_at)
              : null,
          })
          .where(
            or(eq(posts.slug, slugOrPostId), eq(posts.post_id, slugOrPostId))
          );
        const post = await getPost(slugOrPostId);
        revalidateTag("getPost");

        return NextResponse.json(
          {
            data: post,
            message: "Post updated successfully",
            lastUpdate: new Date().getTime(),
          },
          {
            status: 200,
          }
        );
      } catch (error) {
        console.log("Error", error);

        return NextResponse.json(
          { data: null, error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slugOrPostId: string } }
) {
  const { slugOrPostId } = params;
  const oldPost = await getPlainPost(slugOrPostId);
  return await checkPermission(
    {
      requiredPermission: "posts:delete",
    },
    async () => {
      try {
        if (!oldPost)
          return NextResponse.json(
            {
              message: "Post not found",
            },
            { status: 404 }
          );
        await db
          .update(posts)
          .set({ status: "deleted" })
          .where(
            or(eq(posts.slug, slugOrPostId), eq(posts.post_id, slugOrPostId))
          );
        revalidateTag("getPost");
        return NextResponse.json(
          {
            message: "Post deleted successfully",
          },
          { status: 200 }
        );
      } catch (error) {
        console.log("Error", error);
        return NextResponse.json(
          { data: null, error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  );
}
