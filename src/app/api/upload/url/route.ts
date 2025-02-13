import { NextRequest, NextResponse } from "next/server";
import { uploadFromUrl } from "@/src/lib/cloudinary";
import { db } from "@/src/db";
import { medias } from "@/src/db/schemas";
import { eq } from "drizzle-orm";
import { determineFileType } from "@/src/utils/upload";

export async function POST(request: NextRequest) {
  try {
    const { url, folder = "uploads", filename } = await request.json();

    const cloudinaryResponse = await uploadFromUrl({ url, folder, filename });

    const result = await db.transaction(async (tx) => {
      const [response] = await tx
        .insert(medias)
        .values({
          name: filename || cloudinaryResponse.original_filename,
          url: cloudinaryResponse.secure_url,
          type: determineFileType(
            cloudinaryResponse.format || cloudinaryResponse.resource_type
          ),
          size: cloudinaryResponse.bytes,
          mime_type: cloudinaryResponse.format
            ? `image/${cloudinaryResponse.format}`
            : cloudinaryResponse.resource_type,
          width: cloudinaryResponse.width,
          height: cloudinaryResponse.height,
          folder: cloudinaryResponse.folder,
          caption: cloudinaryResponse.caption,
          alt_text:
            cloudinaryResponse.alt_text ||
            filename ||
            cloudinaryResponse.original_filename,
        })
        .$returningId();
      return await tx.query.medias.findFirst({
        where: eq(medias.id, response.id),
      });
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error server:", error);
    return NextResponse.json(
      { error: "Failed to upload from URL" },
      { status: 500 }
    );
  }
}
