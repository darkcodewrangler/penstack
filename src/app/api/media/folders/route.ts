import { db } from "@/src/db";
import { medias } from "@/src/db/schemas";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const folders = await db
      .selectDistinct({ folder: medias.folder })
      .from(medias)
      .orderBy(asc(medias.folder));
    const _folders = folders?.length ? folders.map((f) => f.folder) : [];
    return NextResponse.json({
      message: "Folders retrieved successfully",
      data: _folders,
    });
  } catch (error) {
    return NextResponse.json({
      error,
      data: null,
      message: "Something went wrong... Couldn't fetch folder.",
    });
  }
}
