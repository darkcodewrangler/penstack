import { db } from "@/src/db";
import { categories } from "@/src/db/schemas";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: {
        posts: {
          with: {
            featured_image: {
              columns: {
                url: true,
                id: true,
                caption: true,
                alt_text: true,
              },
            },
            author: {
              columns: {
                name: true,
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      data: category?.posts,
      message: "Category Posts fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error?.message, message: "Something went wrong..." },
      { status: 500 }
    );
  }
}
